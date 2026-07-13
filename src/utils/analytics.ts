
const STORAGE_KEYS = {
  HAS_OPENED_BEFORE: 'usalatesta_has_opened_before',
} as const;

/**
 * Traccia il primo avvio dell'app
 * @returns true se è il primo avvio, false altrimenti
 */
export function trackFirstOpen(): boolean {
  const hasOpenedBefore = localStorage.getItem(STORAGE_KEYS.HAS_OPENED_BEFORE);
  
  if (!hasOpenedBefore) {
    // Primo avvio: traccia l'evento
    localStorage.setItem(STORAGE_KEYS.HAS_OPENED_BEFORE, 'true');
    
    // Qui puoi integrare:
    // 1. Google Analytics 4
    // 2. Firebase Analytics (JS SDK)
    // 3. Google Ads Conversion Tracking
    console.log('🎯 Primo avvio dellapp tracciato!');
    
    // Esempio di evento personalizzato (sostituisci con il tuo tracking)
    if (typeof window !== 'undefined') {
      // Google Analytics 4 (se disponibile)
      (window as any).gtag?.('event', 'first_open_pwa', {
        event_category: 'engagement',
        event_label: 'Primo avvio PWA',
      });
      
      // Firebase Analytics (se disponibile)
      (window as any).analytics?.logEvent('first_open_pwa');
    }
    
    return true;
  }
  
  return false;
}
