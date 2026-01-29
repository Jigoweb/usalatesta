/**
 * WebSocket hook for Vega chatbot.
 * Docs: WEBSOCKET VEGA.txt; API: https://api.vegasystem.org/docs
 */

import { useCallback, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_VEGA_WS_URL ?? 'wss://api.vegasystem.org/api/v1/ws';

type WsMessage =
  | { type: 'system'; content: string }
  | { type: 'error'; content: string }
  | { type: 'chat_token'; content: string }
  | { type: 'chat'; message?: string; content?: string; text?: string };

function parseContent(raw: string): WsMessage | null {
  try {
    const inner = JSON.parse(raw) as Record<string, unknown>;
    const type = inner.type as string;
    const content = inner.content as string | undefined;
    if (type === 'system' || type === 'error' || type === 'chat_token') {
      return { type, content: content ?? '' } as WsMessage;
    }
    if (type === 'chat') {
      return {
        type: 'chat',
        message: inner.message as string | undefined,
        content: inner.content as string | undefined,
        text: inner.text as string | undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Strip <media>...</media> from message text for display (optional: could later resolve to image URL). */
export function stripMediaTags(text: string): string {
  return text.replace(/<media>[\s\S]*?<\/media>/gi, '').trim();
}

export interface UseVegaChatOptions {
  accessToken: string;
  assistantId: number;
  onError?: (message: string) => void;
  onConnected?: () => void;
}

export interface UseVegaChatReturn {
  connect: () => void;
  disconnect: () => void;
  sendMessage: (text: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  /** Streaming text (accumulated) for current assistant reply. */
  streamingText: string;
  /** Call when we've committed streaming text to a message (e.g. on final "chat"). */
  clearStreaming: () => void;
  /** Subscribe to final full message (type "chat"). */
  onFinalMessage: (cb: (text: string) => void) => () => void;
}

export function useVegaChat({
  accessToken,
  assistantId,
  onError,
  onConnected,
}: UseVegaChatOptions): UseVegaChatReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const finalCbRef = useRef<((text: string) => void) | null>(null);

  const onFinalMessage = useCallback((cb: (text: string) => void) => {
    finalCbRef.current = cb;
    return () => {
      finalCbRef.current = null;
    };
  }, []);

  const clearStreaming = useCallback(() => setStreamingText(''), []);

  const scheduledDisconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doClose = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(scheduledDisconnectRef.current ?? undefined);
    scheduledDisconnectRef.current = setTimeout(doClose, 0);
  }, [doClose]);

  const connect = useCallback(() => {
    clearTimeout(scheduledDisconnectRef.current ?? undefined);
    scheduledDisconnectRef.current = null;
    if (!accessToken || !assistantId) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;
    doClose();
    setIsConnecting(true);
    setError(null);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      const handshake = { token: accessToken, assistant_id: Number(assistantId) };
      if (import.meta.env.DEV) console.log('[VegaChat] WebSocket aperto, invio handshake assistant_id:', assistantId);
      ws.send(JSON.stringify(handshake));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data as string) as { content?: string };
        const contentStr = payload.content;
        if (typeof contentStr !== 'string') return;
        const msg = parseContent(contentStr);
        if (!msg) return;

        if (msg.type === 'system') {
          if (msg.content === 'OK') {
            if (import.meta.env.DEV) console.log('[VegaChat] Connesso (OK)');
            setIsConnected(true);
            setIsConnecting(false);
            setError(null);
            onConnected?.();
          }
          return;
        }
        if (msg.type === 'error') {
          if (import.meta.env.DEV) console.error('[VegaChat] Errore server:', msg.content);
          setError(msg.content);
          onError?.(msg.content);
          setIsConnecting(false);
          return;
        }
        if (msg.type === 'chat_token') {
          setStreamingText((prev) => prev + msg.content);
          return;
        }
        if (msg.type === 'chat') {
          const fullText =
            msg.message ?? msg.content ?? msg.text ?? '';
          const displayText = stripMediaTags(fullText);
          setStreamingText('');
          finalCbRef.current?.(displayText);
          return;
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = (ev) => {
      if (import.meta.env.DEV) console.log('[VegaChat] WebSocket chiuso', ev.code, ev.reason);
      wsRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
      setError((prev) => prev || (ev.code !== 1000 ? `Connessione chiusa (code ${ev.code})` : null));
    };

    ws.onerror = () => {
      if (import.meta.env.DEV) console.error('[VegaChat] WebSocket error');
      setError('Errore di connessione WebSocket');
    };
  }, [accessToken, assistantId, doClose, onConnected, onError]);

  const sendMessage = useCallback(
    (text: string) => {
      const ws = wsRef.current;
      if (ws?.readyState !== WebSocket.OPEN) return;
      // Vega backend expects user message; format from docs is implied by response (who: "AI", text, message).
      ws.send(JSON.stringify({ text }));
    },
    []
  );

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
    isConnecting,
    error,
    streamingText,
    clearStreaming,
    onFinalMessage,
  };
}
