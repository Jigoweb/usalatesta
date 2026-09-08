import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  USALATESTA_ASSET_BASE,
  USALATESTA_DIRECT_LINE_TOKEN_URL,
  USALATESTA_PROD_ORIGIN,
  USALATESTA_QUICK_ACTIONS,
  USALATESTA_ROOT_ID,
  USALATESTA_SCRIPT_ID,
  USALATESTA_STYLE_ID,
  __resetUsalatestaWidgetForTests,
  applyUsalatestaConfig,
  buildUsalatestaConfig,
  isProductionOrigin,
  loadUsalatestaWidget,
  syncUsalatestaViewportHeight,
} from '../usalatesta-widget';

describe('usalatesta-widget', () => {
  afterEach(() => {
    __resetUsalatestaWidgetForTests();
  });

  it('buildUsalatestaConfig uses prod values and requires start event', () => {
    const config = buildUsalatestaConfig('test-key');
    expect(config).toEqual({
      useMockTransport: false,
      directLineTokenUrl: USALATESTA_DIRECT_LINE_TOKEN_URL,
      partnerKey: 'test-key',
      sendStartConversationEvent: true,
      locale: 'it-IT',
      quickActions: [...USALATESTA_QUICK_ACTIONS],
      enableVoice: false,
      mountSelector: `#${USALATESTA_ROOT_ID}`,
    });
  });

  it('isProductionOrigin matches only the APIM allowlisted host', () => {
    expect(isProductionOrigin(USALATESTA_PROD_ORIGIN)).toBe(true);
    expect(isProductionOrigin('http://localhost:5173')).toBe(false);
    expect(
      isProductionOrigin('https://traeusalatesta0vr4-git-foo.vercel.app')
    ).toBe(false);
  });

  it('loadUsalatestaWidget sets config before injecting the module script', () => {
    const config = buildUsalatestaConfig('test-key');
    const load = loadUsalatestaWidget(config);
    void load.catch(() => undefined);

    expect(window.UsalatestaConfig).toEqual(config);

    const style = document.getElementById(USALATESTA_STYLE_ID) as HTMLLinkElement;
    const script = document.getElementById(
      USALATESTA_SCRIPT_ID
    ) as HTMLScriptElement;
    expect(style).toBeTruthy();
    expect(style.href).toContain(`${USALATESTA_ASSET_BASE}/usalatesta.css`);
    expect(script.type).toBe('module');
    expect(script.src).toContain(`${USALATESTA_ASSET_BASE}/usalatesta.js`);
  });

  it('loadUsalatestaWidget is a singleton and rejects a missing start event', async () => {
    const config = buildUsalatestaConfig('test-key');
    const first = loadUsalatestaWidget(config);
    void first.catch(() => undefined);

    const firstSrc = (document.getElementById(USALATESTA_SCRIPT_ID) as HTMLScriptElement)
      .src;
    const second = loadUsalatestaWidget(config);
    void second.catch(() => undefined);
    expect((document.getElementById(USALATESTA_SCRIPT_ID) as HTMLScriptElement).src).toBe(
      firstSrc
    );

    await expect(
      loadUsalatestaWidget({ ...config, sendStartConversationEvent: false })
    ).rejects.toThrow(/sendStartConversationEvent/);
  });

  it('applyUsalatestaConfig writes to window before any script tag', () => {
    const spy = vi.spyOn(document.body, 'appendChild');
    applyUsalatestaConfig(buildUsalatestaConfig('abc'));
    expect(window.UsalatestaConfig?.partnerKey).toBe('abc');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('syncUsalatestaViewportHeight sets --ult-viewport-height', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'getBoundingClientRect', {
      value: () => ({ height: 640, width: 360, top: 0, left: 0, bottom: 640, right: 360, x: 0, y: 0, toJSON: () => ({}) }),
    });
    document.body.appendChild(el);
    const stop = syncUsalatestaViewportHeight(el);
    expect(el.style.getPropertyValue('--ult-viewport-height')).toBe('640px');
    stop();
    el.remove();
  });
});
