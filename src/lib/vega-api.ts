/**
 * Vega Chatbot Assistant API client
 * Docs: https://api.vegasystem.org/docs
 */

const BASE_URL = import.meta.env.VITE_VEGA_API_URL ?? 'https://api.vegasystem.org';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
}

let cachedToken: TokenResponse | null = null;

function getStoredToken(): TokenResponse | null {
  if (cachedToken) return cachedToken;
  try {
    const raw = sessionStorage.getItem('vega_token');
    if (raw) {
      cachedToken = JSON.parse(raw) as TokenResponse;
      return cachedToken;
    }
  } catch {
    // ignore
  }
  return null;
}

function storeToken(data: TokenResponse) {
  cachedToken = data;
  sessionStorage.setItem('vega_token', JSON.stringify(data));
}

function clearStoredToken() {
  cachedToken = null;
  sessionStorage.removeItem('vega_token');
}

/** Get access token (email + password). Uses application/x-www-form-urlencoded. */
export async function getAccessToken(username: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams({
    username,
    password,
  });
  const res = await fetch(`${BASE_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Auth failed: ${res.status}`);
  }
  const raw = (await res.json()) as Record<string, unknown>;
  const data: TokenResponse = {
    access_token: (raw.access_token ?? raw.accessToken) as string,
    refresh_token: (raw.refresh_token ?? raw.refreshToken) as string,
    token_type: (raw.token_type ?? raw.tokenType ?? 'bearer') as string,
    expires_in: (raw.expires_in ?? raw.expiresIn) as number | undefined,
  };
  if (!data.access_token) {
    throw new Error('Risposta API senza access_token. Controlla formato risposta.');
  }
  storeToken(data);
  return data;
}

/** Refresh access token using refresh_token. */
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const body = new URLSearchParams({ refresh_token: refreshToken });
  const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    clearStoredToken();
    throw new Error(`Refresh failed: ${res.status}`);
  }
  const raw = (await res.json()) as Record<string, unknown>;
  const data: TokenResponse = {
    access_token: (raw.access_token ?? raw.accessToken) as string,
    refresh_token: (raw.refresh_token ?? raw.refreshToken) as string,
    token_type: (raw.token_type ?? raw.tokenType ?? 'bearer') as string,
    expires_in: (raw.expires_in ?? raw.expiresIn) as number | undefined,
  };
  if (!data.access_token) throw new Error('Refresh: risposta senza access_token');
  storeToken(data);
  return data;
}

/** Ensure we have a valid access token (from cache or refresh). */
export async function ensureToken(
  username: string,
  password: string
): Promise<string> {
  const stored = getStoredToken();
  if (stored?.access_token) {
    if (stored.refresh_token) {
      try {
        const refreshed = await refreshAccessToken(stored.refresh_token);
        return refreshed.access_token;
      } catch {
        // fallback to login
      }
    } else {
      return stored.access_token;
    }
  }
  const data = await getAccessToken(username, password);
  return data.access_token;
}

export interface AssistantDocument {
  id: number;
  file_type: string;
  filename: string;
  original_filename: string;
  description: string;
  content_type: string;
  percentage_upload: number;
  upload_complete: boolean;
  upload_error: boolean;
  s3_path: string;
  faq_text: string;
  uploaded_by: number | null;
  user_created: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssistantResponse {
  id: number;
  name: string;
  description: string;
  subtitle: string;
  personality_id: number;
  group_id: number | null;
  status: string;
  created_by: number | null;
  aspect_id: number;
  created_at: string;
  updated_at: string | null;
  documents: AssistantDocument[];
  [key: string]: unknown;
}

/** Get assistant details (requires Bearer token). */
export async function getAssistant(
  accessToken: string,
  assistantId: number
): Promise<AssistantResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/assistants/${assistantId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error(`Get assistant failed: ${res.status}`);
  return res.json() as Promise<AssistantResponse>;
}

/** Extract FAQ questions from assistant documents (from faq_text field). */
export function extractFAQSuggestions(
  assistant: AssistantResponse,
  maxSuggestions: number = 6
): string[] {
  const suggestions: string[] = [];
  const seen = new Set<string>();
  
  for (const doc of assistant.documents || []) {
    if (!doc.faq_text || doc.faq_text.trim() === '') continue;
    
    // Parse FAQ format: "Q: question text\nanswer text\n\nQ: ..."
    const faqText = doc.faq_text;
    const questionMatches = faqText.match(/Q:\s*([^\n]+)/g);
    
    if (questionMatches) {
      for (const match of questionMatches) {
        const question = match.replace(/^Q:\s*/, '').trim();
        if (question && question.length > 0 && !seen.has(question.toLowerCase())) {
          seen.add(question.toLowerCase());
          suggestions.push(question);
          if (suggestions.length >= maxSuggestions) break;
        }
      }
    }
    
    if (suggestions.length >= maxSuggestions) break;
  }
  
  return suggestions;
}

/** Delete assistant memories / chat history (requires Bearer token). */
export async function deleteAssistantMemories(
  accessToken: string,
  assistantId: number
): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/v1/assistants/${assistantId}/memories`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Delete memories failed: ${res.status}`);
}

export function clearToken() {
  clearStoredToken();
}
