import os
import json
import traceback
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Initialize Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in .env file.")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env file.")
client = genai.Client(api_key=GEMINI_API_KEY)
# We use a fast, high-quality model for reasoning and generation
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

# Load Master Tech Data locally to help with entity extraction
with open("master_tech_data.json", "r", encoding="utf-8") as f:
    master_data = json.load(f)
    
# Extract simple mapper for LLM context
tech_catalog = [{"primary_name": t.get("primary_name"), "category": t.get("category"), "synonyms": t.get("synonyms", [])} for t in master_data]

# We let the LLM know about the shape of the database tables
DB_SCHEMA = """
Table: public.tech_metrics
Columns:
- id (uuid, primary key)
- topic_name (varchar 255): The exact name of the technology (e.g., 'Agentic AI Systems')
- iso_week (varchar 10): The week data was recorded (e.g., '2025-W12')
- jobs (integer): Vacancy count
- github (integer): GitHub repository count
- trends (double precision): Search interest score
- news (integer): News article volume
- created_at (timestamp)
"""

def step_2_identify_entities(user_query: str) -> dict:
    """Uses LLM to identify tech name and assign primary_name and category based on master_tech_data."""
    print(" [Step 2] 🧠 Identifying technology entities...")
    
    prompt = f"""
    You are an entity extraction module. 
    User Query: "{user_query}"
    
    Using this JSON catalog of valid technologies: {json.dumps(tech_catalog)}
    
    Identify which specific technology the user is asking about.
    Return strictly a JSON object with two keys:
    - "primary_name": The exact primary_name from the catalog.
    - "category_name": The exact category from the catalog.
    If no match is found, return null for both.
    """
    
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.1
        )
    )
    return json.loads(response.text)

def step_3_generate_supabase_query(primary_name: str, category_name: str, user_query: str) -> str:
    """Uses LLM to generate Supabase python client code to fetch the right data."""
    print(" [Step 3] 🏗️ Generating dynamic Supabase query...")
    
    prompt = f"""
    You are a Supabase-Py Query Architect. 
    User Question: "{user_query}"
    Identified Tech: "{primary_name}"
    Category: "{category_name}"
    
    Database Schema available:
    {DB_SCHEMA}
    
    Generate Python code using the official `supabase-py` syntax to retrieve the answer.
    - The Supabase client is already initialized as the variable `supabase`.
    - You MUST assign the final data result to a variable named `retrieved_data`.
    - Example: 
      response = supabase.table('tech_metrics').select('*').eq('topic_name', '{primary_name}').order('iso_week', desc=True).execute()
      retrieved_data = response.data
    
    Return ONLY valid, highly secure Python code. Do not use markdown backticks (```) or any explanations. Just the code.
    """
    
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.1)
    )
    
    # Clean up markdown if the LLM leaked it
    code = response.text.strip()
    if code.startswith("```python"): code = code[9:]
    elif code.startswith("```"): code = code[3:]
    if code.endswith("```"): code = code[:-3]
    return code.strip()

def step_4_execute_query(code: str):
    """Executes the generated Supabase query code securely."""
    print(" [Step 4] 📡 Executing query on Supabase...")
    
    # Provide the execution environment
    local_vars = {"supabase": supabase}
    try:
        exec(code, {}, local_vars)
        return local_vars.get("retrieved_data", [])
    except Exception as e:
        print(f"    [!] Query Execution Failed: {e}")
        print(f"    [!] Code attempted:\n{code}")
        return {"error": str(e), "code_attempted": code}

def step_5_generate_human_response(user_query: str, retrieved_data: any) -> str:
    """Converts the raw JSON data into a conversational response."""
    print(" [Step 5] 💬 Formulating conversational insights...")
    
    prompt = f"""
    The user asked: "{user_query}"
    
    You queried the database and retrieved this raw JSON data:
    {json.dumps(retrieved_data, default=str)}
    
    Convert this raw data into a highly conversational, insightful, and professional response. 
    Do not mention the database or the JSON format. 
    Read the numbers and explain what they mean to the user directly.
    """
    
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(temperature=0.7)
    )
    return response.text

def main():
    print("\n" + "="*60)
    print("🔮 Agentic RAG Pipeline (Gemini + Supabase)")
    print("="*60)
    
    while True:
        try:
            # Step 1: User queries
            user_query = input("\n[Step 1] Ask about a technology trend (or type 'quit'): ").strip()
            if not user_query: continue
            if user_query.lower() in ['quit', 'exit']: break
            
            # Step 2: Extract entities
            entities = step_2_identify_entities(user_query)
            primary_name = entities.get("primary_name")
            category_name = entities.get("category_name")
            print(f"    -> Mapped to: {primary_name} ({category_name})")
            
            if not primary_name:
                print("\n🤖 I couldn't find a matching technology in the master catalog. Please try rephrasing.")
                continue
                
            # Step 3: Generate query
            query_code = step_3_generate_supabase_query(primary_name, category_name, user_query)
            
            # Step 4: Execute query
            retrieved_data = step_4_execute_query(query_code)
            if not retrieved_data:
                print("\n🤖 I queried the database but found no specific records for this technology in that context.")
                continue
                
            print(f"    [DEBUG] Successfully retrieved {len(retrieved_data)} records from Supabase!")
            print(f"    [DEBUG] Raw JSON Snippet: {json.dumps(retrieved_data, indent=2)[:500]}...\n")
                
            # Step 5: Conversational output
            final_answer = step_5_generate_human_response(user_query, retrieved_data)
            
            print("\n" + "="*60)
            print("🤖 RESULT:")
            print("="*60)
            print(final_answer)
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\n❌ Pipeline Error: {traceback.format_exc()}")

if __name__ == "__main__":
    main()
