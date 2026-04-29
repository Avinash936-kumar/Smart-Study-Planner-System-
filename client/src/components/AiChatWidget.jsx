import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles, HiXMark, HiPaperAirplane } from 'react-icons/hi2';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI Study Assistant. I can help with roadmaps (try 'roadmap python') or give study advice. How can I help?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg });
      if (res.data.success) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: res.data.data, sender: 'ai' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Oops! I am having trouble connecting.', sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-xl shadow-primary-500/30 flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <HiSparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-surface-200 dark:border-surface-800 flex justify-between items-center bg-gradient-to-r from-primary-500 to-accent-500 text-white">
              <div className="flex items-center gap-2">
                <HiSparkles className="w-5 h-5" />
                <h3 className="font-display font-bold">Study Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-surface-50 dark:bg-surface-950 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-primary-500 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-700 rounded-tl-sm'
                  }`}>
                    {msg.sender === 'ai' ? (
                      <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-pre:my-1 prose-pre:bg-surface-100 dark:prose-pre:bg-surface-900 prose-pre:text-surface-800 dark:prose-pre:text-surface-200">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for a roadmap..."
                  className="w-full bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HiPaperAirplane className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatWidget;
