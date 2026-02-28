from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import rag_pipeline
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str | None = None

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        user_query = req.message
        print(f"Received query: {user_query}")
        
        entities = rag_pipeline.step_2_identify_entities(user_query)
        primary_name = entities.get("primary_name")
        category_name = entities.get("category_name")
        
        if not primary_name:
            reply = "I couldn't find a specifically matching technology in the catalog. Could you please specify which tech you're asking about?"
        else:
            print(f"Identified entity: {primary_name} ({category_name})")
            
            query_code = rag_pipeline.step_3_generate_supabase_query(primary_name, category_name, user_query)
            retrieved_data = rag_pipeline.step_4_execute_query(query_code)
            
            if not retrieved_data or (isinstance(retrieved_data, dict) and "error" in retrieved_data):
                reply = "I tried checking the database but couldn't find context for this specific request right now."
            else:
                reply = rag_pipeline.step_5_generate_human_response(user_query, retrieved_data)
                
        # Store in database if a user_id is provided
        if req.user_id:
            try:
                rag_pipeline.supabase.table('chat_history').insert({
                    "user_id": req.user_id,
                    "query": user_query,
                    "reply": reply
                }).execute()
            except Exception as e:
                print(f"Failed to store chat history: {e}")
        
        return {"reply": reply}

    except Exception as e:
        print(traceback.format_exc())
        return {"reply": "I encountered an error while processing your request. Please try again later."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5003)
