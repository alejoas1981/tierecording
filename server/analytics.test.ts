import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('Google Analytics integration', () => {
  it('does not load or send events without a measurement ID', async () => {
    const appendChild = vi.fn();
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { head: { appendChild } });

    const { initializeAnalytics, trackEvent } = await import('../client/src/lib/analytics');
    initializeAnalytics();
    trackEvent('checklist_completed');

    expect(appendChild).not.toHaveBeenCalled();
    expect(window.gtag).toBeUndefined();
  });

  it('loads once, removes query data from page location, and queues events', async () => {
    const appendChild = vi.fn(),
      script = { async: false, src: '' };
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.stubGlobal('window', { location: { origin: 'https://example.com', pathname: '/' }, addEventListener: vi.fn() });
    vi.stubGlobal('document', { createElement: vi.fn(() => script), head: { appendChild } });

    const { initializeAnalytics, trackEvent } = await import('../client/src/lib/analytics');
    initializeAnalytics();
    initializeAnalytics();
    trackEvent('section_view', { section: 'documents' });

    expect(appendChild).toHaveBeenCalledOnce();
    expect(script.async).toBe(true);
    expect(script.src).toContain('id=G-TEST123');
    expect(Array.from(window.dataLayer![1])).toEqual(['config', 'G-TEST123', { page_location: 'https://example.com/' }]);
    expect(Array.from(window.dataLayer![2])).toEqual(['event', 'section_view', { section: 'documents' }]);
  });

  it('reports scroll thresholds once and skips pages without scrollable content', async () => {
    let scrollListener: (() => void) | undefined;
    const browser = {
        location: { origin: 'https://example.com', pathname: '/' },
        innerHeight: 1000,
        scrollY: 0,
        addEventListener: vi.fn((_name: string, listener: () => void) => { scrollListener = listener; }),
      },
      documentElement = { scrollHeight: 1000 };
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.stubGlobal('window', browser);
    vi.stubGlobal('document', { createElement: () => ({}), head: { appendChild: vi.fn() }, documentElement });

    const { initializeAnalytics } = await import('../client/src/lib/analytics');
    initializeAnalytics();
    expect(scrollListener).toBeDefined();
    scrollListener!();
    expect(window.dataLayer).toHaveLength(2);
    documentElement.scrollHeight = 2000;
    browser.scrollY = 760;
    scrollListener!();
    scrollListener!();
    browser.scrollY = 900;
    scrollListener!();

    const events = window.dataLayer!.slice(2).map(event => Array.from(event));
    expect(events).toEqual([25, 50, 75, 90].map(depth =>
      ['event', 'scroll_depth', { percent_scrolled: String(depth) }]));
  });

  it('tracks only annotated buttons including clicks on their children', async () => {
    const gtag = vi.fn();
    class FakeElement {
      constructor(private buttonId?: string) {}
      closest() { return this.buttonId ? { dataset: { analyticsButton: this.buttonId } } : null; }
    }
    vi.stubGlobal('Element', FakeElement);
    vi.stubGlobal('window', { gtag });
    const { trackButtonClick } = await import('../client/src/lib/analytics');

    trackButtonClick(new FakeElement('hero_route') as unknown as EventTarget);
    trackButtonClick(new FakeElement() as unknown as EventTarget);
    trackButtonClick(null);

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'button_click', { button_id: 'hero_route' });
  });

  it('does not interrupt an action if the analytics function fails', async () => {
    vi.stubGlobal('window', { gtag: () => { throw new Error('blocked'); } });
    const { trackEvent } = await import('../client/src/lib/analytics');
    expect(() => trackEvent('checklist_printed')).not.toThrow();
  });
});
