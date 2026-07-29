import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  EVENT_CATALOG,
  trackEvent,
  trackFirstOpen,
  trackOutboundClick,
  trackPageView,
} from '../analytics';

describe('analytics dataLayer helpers', () => {
  beforeEach(() => {
    window.dataLayer = [];
    localStorage.clear();
    vi.useRealTimers();
  });

  it('trackEvent pushes event + params to dataLayer', () => {
    trackEvent('test_progress', { step_number: 3 });
    expect(window.dataLayer).toEqual([{ event: 'test_progress', step_number: 3 }]);
  });

  it('trackPageView emits virtual_page_view with path', () => {
    trackPageView('/home');
    expect(window.dataLayer[0]).toMatchObject({
      event: 'virtual_page_view',
      page_path: '/home',
    });
  });

  it('trackFirstOpen fires once', () => {
    expect(trackFirstOpen()).toBe(true);
    expect(window.dataLayer.some((e) => e.event === 'pwa_first_open')).toBe(true);
    window.dataLayer = [];
    expect(trackFirstOpen()).toBe(false);
    expect(window.dataLayer).toHaveLength(0);
  });

  it('trackOutboundClick delays navigation after push', () => {
    vi.useFakeTimers();
    const hrefSpy = vi.fn();
    const original = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...original, href: '' },
    });
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      set: hrefSpy,
      get: () => '',
    });

    trackOutboundClick('supporto_chiamaCentro', { regione: 'Lazio', comune: 'Roma' }, 'tel:800123');
    expect(window.dataLayer[0]).toMatchObject({
      event: 'supporto_chiamaCentro',
      regione: 'Lazio',
      comune: 'Roma',
    });
    expect(hrefSpy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(hrefSpy).toHaveBeenCalledWith('tel:800123');

    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });
});

describe('EventCatalog wiring (static source scan)', () => {
  const root = resolve(__dirname, '../..');
  const filesToScan = [
    'pages/Home.tsx',
    'pages/Decalogo.tsx',
    'pages/Quiz.tsx',
    'pages/QuizResult.tsx',
    'pages/Chatbot.tsx',
    'pages/ArticleDetail.tsx',
    'pages/HelpCenters.tsx',
    'pages/BrainExperience.tsx',
    'pages/LabyrinthExperience.tsx',
    'components/CerchiAiuto.tsx',
    'contexts/TimerContext.tsx',
    'hooks/useBrainExperience.ts',
  ].map((f) => resolve(root, f));

  const sourceBlob = filesToScan.map((f) => readFileSync(f, 'utf8')).join('\n');

  // Widget embed: nessun hook host sull'invio messaggio finché il kit non espone eventi.
  const deferredEvents = new Set(['chat_messageSend']);

  it.each([...EVENT_CATALOG])('catalog event %s is referenced in app code', (eventName) => {
    if (deferredEvents.has(eventName)) return;
    expect(sourceBlob.includes(`'${eventName}'`) || sourceBlob.includes(`"${eventName}"`)).toBe(true);
  });
});

describe('GTM + Consent Mode bootstrap (index.html)', () => {
  const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8');

  it('embeds GTM-KHV3DFNR head snippet before body content', () => {
    expect(html).toContain("googletagmanager.com/gtm.js?id='+i+dl");
    expect(html).toContain("'GTM-KHV3DFNR'");
    const headIdx = html.indexOf('</head>');
    const gtmIdx = html.indexOf("GTM-KHV3DFNR");
    expect(gtmIdx).toBeGreaterThan(-1);
    expect(gtmIdx).toBeLessThan(headIdx);
  });

  it('embeds GTM noscript iframe immediately after body open', () => {
    expect(html).toContain('googletagmanager.com/ns.html?id=GTM-KHV3DFNR');
    const bodyOpen = html.indexOf('<body>');
    const noscript = html.indexOf('Google Tag Manager (noscript)');
    expect(noscript).toBeGreaterThan(bodyOpen);
    expect(noscript - bodyOpen).toBeLessThan(80);
  });

  it('sets Consent Mode v2 defaults to denied before GTM', () => {
    const consentIdx = html.indexOf("gtag('consent', 'default'");
    const gtmSnippetIdx = html.indexOf("googletagmanager.com/gtm.js?id=");
    expect(consentIdx).toBeGreaterThan(-1);
    expect(gtmSnippetIdx).toBeGreaterThan(-1);
    expect(consentIdx).toBeLessThan(gtmSnippetIdx);
    for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']) {
      expect(html).toMatch(new RegExp(`'${key}':\\s*'denied'`));
    }
    expect(html).toContain("'wait_for_update': 500");
  });
});
