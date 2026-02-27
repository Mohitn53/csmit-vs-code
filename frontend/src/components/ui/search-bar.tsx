"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SearchItem {
  id: string;
  title: string;
  category?: string;
  type: "topic" | "category";
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [searchData, setSearchData] = useState<SearchItem[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchTopics() {
      const { data, error } = await supabase
        .from('tech_metrics')
        .select('topic_name')
        .limit(2000);
        // We just need unique topics, but Supabase JS doesn't have a distinct() method directly on select
        // So we fetch all and deduplicate in JS, or we could use a view.
        // For now, we'll just fetch and deduplicate.
      
      if (data && !error) {
        const uniqueTopics = Array.from(new Set(data.map(item => item.topic_name)));
        const formattedData: SearchItem[] = uniqueTopics.map((topic, index) => ({
          id: `topic-${index}`,
          title: topic,
          type: "topic"
        }));
        
        // Add some static categories
        formattedData.push(
          { id: "cat-1", title: "Developer & Intelligence", type: "category" },
          { id: "cat-2", title: "Physical AI & Robotics", type: "category" },
          { id: "cat-3", title: "Mobility & SDV", type: "category" },
          { id: "cat-4", title: "Edge & Hardware", type: "category" },
          { id: "cat-5", title: "Mobile & Electronics", type: "category" }
        );
        
        setSearchData(formattedData);
      }
    }
    
    fetchTopics();

    // Handle click outside to close
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery("");
    if (item.type === "topic") {
      // Route to a topic detail page (you can create this page later)
      router.push(`/dashboard/topic/${encodeURIComponent(item.title)}`);
    } else {
      // Route to category page
      const catId = item.id.replace('cat-', '');
      router.push(`/categories/${catId}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative hidden sm:block z-50">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          placeholder="Search topics, categories..." 
          className="h-9 w-64 lg:w-80 rounded-full bg-white/5 border border-white/10 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-full glass-panel border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto py-2">
                {results.map((item, i) => (
                  <div 
                    key={i}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-white">{item.title}</span>
                      <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </div>
                    {item.category && (
                      <div className="text-xs text-muted-foreground mt-1">in {item.category}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
