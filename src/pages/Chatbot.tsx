import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';
import { ensureToken, getAssistant, extractFAQSuggestions } from '../lib/vega-api';
import { useVegaChat } from '../hooks/useVegaChat';
import ComingSoonOverlay from '../components/ComingSoonOverlay';
import aComponentImg from '../assets/images/a_component.png';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PRIVACY_CONSENT_KEY = 'usalatesta_chat_privacy_consent';
const WELCOME_MESSAGE =
  'Ciao! Sono il tuo assistente virtuale di **Usa la Testa**. Sono qui per aiutarti con informazioni sul gioco responsabile. Come posso aiutarti oggi?';

const VEGA_USER = import.meta.env.VITE_VEGA_USER ?? '';
const VEGA_PASSWORD = import.meta.env.VITE_VEGA_PASSWORD ?? '';
const VEGA_ASSISTANT_ID = Number(import.meta.env.VITE_VEGA_ASSISTANT_ID ?? '310');
const CHATBOT_COMING_SOON = import.meta.env.VITE_CHATBOT_COMING_SOON === 'true';

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** Simple markdown renderer: converts **bold** to <strong>bold</strong> */
function renderMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\*\*([^*]+)\*\*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [allFaqs, setAllFaqs] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [hasConsent, setHasConsent] = useState(
    () => localStorage.getItem(PRIVACY_CONSENT_KEY) === 'true'
  );
  const welcomeSentRef = useRef(false);
  const lastMessageWasFaqRef = useRef(false);
  const allFaqsRef = useRef<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    allFaqsRef.current = allFaqs;
    if (allFaqs.length > 0) {
      setSuggestions(pickRandom(allFaqs, 4));
    }
  }, [allFaqs]);

  const handleFinalMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
      },
    ]);
    setIsWaitingForResponse(false);

    if (lastMessageWasFaqRef.current && allFaqsRef.current.length > 0) {
      setSuggestions(pickRandom(allFaqsRef.current, 4));
      lastMessageWasFaqRef.current = false;
    }
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

  useEffect(() => {
    if (!VEGA_USER || !VEGA_PASSWORD) {
      setAuthError('Configura VITE_VEGA_USER e VITE_VEGA_PASSWORD in .env');
      return;
    }
    let cancelled = false;
    ensureToken(VEGA_USER, VEGA_PASSWORD)
      .then(async (accessToken) => {
        if (!cancelled) {
          if (import.meta.env.DEV)
            console.log('[Chatbot] Token ottenuto, lunghezza:', accessToken?.length);
          setToken(accessToken);
          try {
            const assistant = await getAssistant(accessToken, VEGA_ASSISTANT_ID);
            const faqSuggestions = extractFAQSuggestions(assistant);
            if (faqSuggestions.length > 0) {
              if (import.meta.env.DEV)
                console.log('[Chatbot] FAQ suggerimenti trovati:', faqSuggestions.length);
              setAllFaqs(faqSuggestions);
            }
          } catch (err) {
            if (import.meta.env.DEV)
              console.warn('[Chatbot] Errore nel caricamento assistente per FAQ:', err);
          }
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setAuthError(err.message || 'Errore di autenticazione');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    connect();
    return () => disconnect();
  }, [token, connect, disconnect]);

  useEffect(() => {
    if (hasConsent && isConnected && !welcomeSentRef.current) {
      welcomeSentRef.current = true;
      setMessages((prev) => [
        ...prev,
        {
          id: 'welcome',
          role: 'assistant',
          content: WELCOME_MESSAGE,
        },
      ]);
    }
  }, [hasConsent, isConnected]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  useEffect(() => {
    if (streamingText) {
      setIsWaitingForResponse(false);
    }
  }, [streamingText]);

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
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    clearStreaming();
    setIsWaitingForResponse(true);
    sendMessage(messageText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    lastMessageWasFaqRef.current = true;
    handleSend(suggestion);
  };

  const handleConsent = () => {
    localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
    setHasConsent(true);
  };

  const isBusy = isWaitingForResponse || !!streamingText;
  const errorMessage = authError || wsError;
  const canSend = isConnected && !!input.trim() && !isBusy;

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col overflow-hidden">
      <ComingSoonOverlay
        enabled={CHATBOT_COMING_SOON}
        icon={MessageSquare}
        title="Chatbot"
        zIndex={45}
      />

      {/* Decorative background */}
      <img
        src={aComponentImg}
        alt=""
        className="absolute -left-8 bottom-48 w-[70%] max-w-[350px] h-auto object-contain opacity-40 pointer-events-none select-none z-0 mix-blend-multiply"
      />

      {/* Privacy consent modal */}
      {!hasConsent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-xl">
                <ShieldCheck className="text-primary-blue" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Privacy e consenso
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              Per utilizzare il chatbot, è necessario acconsentire al
              trattamento dei tuoi dati. Le conversazioni vengono elaborate per
              fornirti risposte pertinenti sul gioco responsabile.
            </p>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              I tuoi dati saranno trattati in conformità con la nostra{' '}
              <a
                href="/privacy"
                className="text-primary-blue underline hover:text-blue-900"
              >
                informativa sulla privacy
              </a>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Torna indietro
              </button>
              <button
                onClick={handleConsent}
                className="flex-1 px-4 py-2.5 bg-primary-blue text-white rounded-xl text-sm font-medium hover:bg-blue-900 transition-colors"
              >
                Acconsento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection / error banner */}
      {errorMessage && (
        <div className="relative z-10 px-4 py-2 bg-red-50 text-red-800 text-sm border-b border-red-200">
          {errorMessage}
        </div>
      )}
      {!errorMessage && isConnecting && (
        <div className="relative z-10 px-4 py-2 bg-blue-50 text-primary-blue text-sm border-b border-blue-200">
          Connessione in corso...
        </div>
      )}

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 pb-48 space-y-4">
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
                {message.role === 'assistant'
                  ? renderMarkdown(message.content)
                  : message.content}
              </p>
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white text-gray-800 shadow-sm">
              <p className="text-sm whitespace-pre-wrap break-words">
                {renderMarkdown(streamingText)}
              </p>
            </div>
          </div>
        )}
        {isWaitingForResponse && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2">
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
                <span className="text-xs text-gray-500">Sto scrivendo...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer with FAQ chips */}
      <div className="bg-white border-t border-gray-200 px-4 pt-3 pb-4 fixed bottom-16 left-0 right-0 z-40">
        {suggestions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={!isConnected || isBusy}
                className="flex-shrink-0 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 hover:border-primary-lightblue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
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
