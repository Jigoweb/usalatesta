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

/**
 * Virtual pageview for SPA route changes.
 * GTM/GA4 need an explicit signal because history API navigations
 * do not reload the page (and thus do not re-fire the default page_view).
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent('virtual_page_view', {
    page_path: path,
    page_title: title ?? (typeof document !== 'undefined' ? document.title : path),
  });
}

/**
 * Track then navigate to an external URL (tel:, maps, mailto, http).
 * A short delay gives GTM time to process the dataLayer push before
 * the browser leaves the page / opens the native app.
 */
export function trackOutboundClick(
  event: string,
  params: Record<string, unknown>,
  url: string,
  options?: { target?: '_blank' | '_self'; delayMs?: number }
): void {
  trackEvent(event, params);
  const delayMs = options?.delayMs ?? 200;
  const target = options?.target ?? '_self';

  window.setTimeout(() => {
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }, delayMs);
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

/** Event names from EventCatalog_UsaLaTesta_App (luglio 2026). */
export const EVENT_CATALOG = [
  'test_tap',
  'test_start',
  'test_progress',
  'test_end',
  'supporto_tapCTA',
  'supporto_scopriCentri',
  'supporto_chiamaCentro',
  'supporto_vediMaps',
  'countdown_start',
  'countdown_end',
  'chat_messageSend',
  'experience_start',
  'experience_end',
  'blog_cta_leggiAltro',
] as const;

export type CatalogEventName = (typeof EVENT_CATALOG)[number];
