import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'Cosa posso fare oggi?',
  'Come posso gestire meglio il mio tempo?',
  'Dammi consigli per il gioco responsabile',
  'Come riconosco i segnali di allarme?',
  'Quali sono le risorse disponibili?',
  'Come posso aiutare qualcuno che conosco?',
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly calculate new scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set new height based on scrollHeight, max 128px
      const newHeight = Math.min(textareaRef.current.scrollHeight, 128);
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Handle scrollbar visibility based on content height
      if (textareaRef.current.scrollHeight > 128) {
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // TODO: Replace this mock response with websocket integration
    // WebSocket connection will be added here to send message and receive assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Grazie per la tua domanda. Questa è una risposta di esempio. La funzionalità di chat completa sarà disponibile presto.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  };

  const showSuggestions = messages.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-4">
        {showSuggestions ? (
          <div className="space-y-6">
            <div className="text-center pt-8">
              <p className="text-gray-600 text-sm">Scrivi una domanda per iniziare</p>
            </div>
            
            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-primary-lightblue transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-blue text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <div className="bg-white border-t border-gray-200 p-4 fixed bottom-16 left-0 right-0 z-40">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-base leading-6 focus:outline-none focus:ring-2 focus:ring-primary-lightblue focus:border-transparent scrollbar-hide"
            style={{
              minHeight: '48px',
              maxHeight: '128px',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className={`p-3 rounded-xl transition-colors mb-[1px] ${
              input.trim()
                ? 'bg-primary-blue text-white hover:bg-blue-900'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
