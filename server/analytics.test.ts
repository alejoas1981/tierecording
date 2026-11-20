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
    vi.stubGlobal('window', { location: { origin: 'https://example.com', pathname: '/' } });
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

  it('does not interrupt an action if the analytics function fails', async () => {
    vi.stubGlobal('window', { gtag: () => { throw new Error('blocked'); } });
    const { trackEvent } = await import('../client/src/lib/analytics');
    expect(() => trackEvent('checklist_printed')).not.toThrow();
  });
});
