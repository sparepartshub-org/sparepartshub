/**
 * ChatBot — floating AI chatbot widget
 */
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chat.service';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { GiAutoRepair } from 'react-icons/gi';

const ChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! 👋 I\'m your SparePartsHub assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await chatService.sendMessage({ message: userMsg, sessionId });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-steel-200 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-primary-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GiAutoRepair className="text-accent-300" />
              <div>
                <p className="font-semibold text-sm">SparePartsHub Assistant</p>
                <p className="text-xs text-blue-200">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-accent-200 transition">
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-steel-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary-500 text-white rounded-br-sm'
                      : 'bg-white border border-steel-200 text-steel-700 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-steel-200 px-4 py-2 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-steel-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-steel-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 input-field text-sm py-2"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="btn-primary px-3 py-2 disabled:opacity-50"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-500 hover:bg-primary-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? <FiX className="text-2xl" /> : <FiMessageCircle className="text-2xl" />}
      </button>
    </div>
  );
};

export default ChatBot;
