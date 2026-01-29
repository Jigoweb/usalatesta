import { useState, useRef, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';
import { ensureToken } from '../lib/vega-api';
import { useVegaChat } from '../hooks/useVegaChat';

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

const VEGA_USER = import.meta.env.VITE_VEGA_USER ?? '';
const VEGA_PASSWORD = import.meta.env.VITE_VEGA_PASSWORD ?? '';
const VEGA_ASSISTANT_ID = Number(import.meta.env.VITE_VEGA_ASSISTANT_ID ?? '310');

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFinalMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const onVegaError = useCallback((msg: string) => {
    setAuthError((prev) => prev || msg);
  }, []);
  const onVegaConnected = useCallback(() => {
    setAuthError(null);
  }, []);

  const {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    isConnecting,
    error: wsError,
    streamingText,
    clearStreaming,
    onFinalMessage,
  } = useVegaChat({
    accessToken: token ?? '',
    assistantId: VEGA_ASSISTANT_ID,
    onError: onVegaError,
    onConnected: onVegaConnected,
  });

  useEffect(() => {
    const unsub = onFinalMessage(handleFinalMessage);
    return unsub;
  }, [onFinalMessage, handleFinalMessage]);

  // Auth on mount
  useEffect(() => {
    if (!VEGA_USER || !VEGA_PASSWORD) {
      setAuthError('Configura VITE_VEGA_USER e VITE_VEGA_PASSWORD in .env');
      return;
    }
    let cancelled = false;
    ensureToken(VEGA_USER, VEGA_PASSWORD)
      .then((accessToken) => {
        if (!cancelled) {
          if (import.meta.env.DEV) console.log('[Chatbot] Token ottenuto, lunghezza:', accessToken?.length);
          setToken(accessToken);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setAuthError(err.message || 'Errore di autenticazione');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Connect WebSocket when we have token
  useEffect(() => {
    if (!token) return;
    connect();
    return () => disconnect();
  }, [token, connect, disconnect]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 128);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > 128 ? 'auto' : 'hidden';
    }
  }, [input]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;
    if (!isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    clearStreaming();
    sendMessage(messageText);
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
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const showSuggestions = messages.length === 0;
  const errorMessage = authError || wsError;
  const canSend = isConnected && !!input.trim();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
      {/* Connection / error banner */}
      {errorMessage && (
        <div className="px-4 py-2 bg-red-50 text-red-800 text-sm border-b border-red-200">
          {errorMessage}
        </div>
      )}
      {!errorMessage && isConnecting && (
        <div className="px-4 py-2 bg-blue-50 text-primary-blue text-sm border-b border-blue-200">
          Connessione in corso...
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-4">
        {showSuggestions ? (
          <div className="space-y-6">
            <div className="text-center pt-8">
              <p className="text-gray-600 text-sm">
                Scrivi una domanda per iniziare
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={!isConnected}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-primary-lightblue transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-blue text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white text-gray-800 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {streamingText}
                  </p>
                </div>
              </div>
            )}
            {!streamingText && !isConnected && messages.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
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
            placeholder={
              isConnected
                ? 'Scrivi un messaggio...'
                : 'Connessione in corso...'
            }
            rows={1}
            disabled={!isConnected}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-base leading-6 focus:outline-none focus:ring-2 focus:ring-primary-lightblue focus:border-transparent scrollbar-hide disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              minHeight: '48px',
              maxHeight: '128px',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            className={`p-3 rounded-xl transition-colors mb-[1px] ${
              canSend
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
