import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: "Hi! I am the TechIntel AI. I have access to all our tracked technology trends. Ask me anything!" }
  ])
  const [inputMsg, setInputMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (msg: string = inputMsg) => {
    if (!msg.trim()) return;
    
    // Add user message
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: msg }
    setMessages(prev => [...prev, userMessage])
    setInputMsg('')
    
    // If we're not open, open it
    if (!isOpen) {
      setIsOpen(true)
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5003/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await response.json()
      
      const botMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: data.reply }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: "I'm sorry, I couldn't reach the AI service right now." }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Bar (when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
          >
            <div className="glass-card bg-[#111118]/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center gap-3">
              <div className="bg-indigo-500/20 p-2 rounded-full hidden sm:flex">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <input 
                type="text" 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
                placeholder="Ask TechIntel AI about trends (e.g. 'How is AI doing?')..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-muted-foreground px-3 text-sm sm:text-base focus:ring-0"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 sm:px-6 sm:py-2 rounded-full transition-all flex items-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#111118]"
              >
                <span className="hidden sm:inline">Ask AI</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Chat Panel (when open) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 bottom-0 right-0 z-[100] w-full max-w-md bg-[#0a0a0f] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111118]/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">TechIntel RAG Agent</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-indigo-600'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-zinc-800 text-white rounded-tr-sm' 
                        : 'bg-[#18181b] border border-white/10 text-zinc-300 rounded-tl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="p-4 rounded-2xl bg-[#18181b] border border-white/10 text-zinc-300 rounded-tl-sm flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-white/10 bg-[#111118]/80">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend()
                  }}
                  placeholder="Type your message..."
                  className="w-full bg-[#18181b] border border-white/10 text-white placeholder-muted-foreground px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 pr-12 transition-colors"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputMsg.trim()}
                  className="absolute right-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
