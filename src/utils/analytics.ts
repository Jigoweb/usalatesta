declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Push an event to the dataLayer for GTM to pick up.
 * GTM (not this code) decides which tags (GA4/Meta/GAds) actually fire.
 */
export function trackEvent(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

const STORAGE_KEYS = {
  HAS_OPENED_BEFORE: 'usalatesta_has_opened_before',
} as const;

/**
 * Traccia il primo avvio dell'app (segnale web-side: first_visit-equivalent,
 * NON il first_open nativo Firebase — quello richiede SDK nativo Android/iOS).
 * @returns true se è il primo avvio, false altrimenti
 */
export function trackFirstOpen(): boolean {
  const hasOpenedBefore = localStorage.getItem(STORAGE_KEYS.HAS_OPENED_BEFORE);

  if (!hasOpenedBefore) {
    localStorage.setItem(STORAGE_KEYS.HAS_OPENED_BEFORE, 'true');
    trackEvent('pwa_first_open');
    return true;
  }

  return false;
}
