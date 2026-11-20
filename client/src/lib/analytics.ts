type AnalyticsEvent =
  | 'button_click'
  | 'scroll_depth'
  | 'section_view'
  | 'checklist_item_completed'
  | 'checklist_completed'
  | 'appointment_check_logged'
  | 'spanish_template_copied'
  | 'official_link_clicked'
  | 'checklist_printed';

type AnalyticsParameters = Record<string, string>;
type GoogleTag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: GoogleTag;
  }
}

let initialized = false;

export function initializeAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

  if (initialized || !measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: `${window.location.origin}${window.location.pathname}`,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  trackScrollDepth();
}

export function trackEvent(name: AnalyticsEvent, parameters?: AnalyticsParameters): void {
  try {
    window.gtag?.('event', name, parameters);
  } catch {
    // Analytics must not interrupt the user's action.
  }
}

function trackScrollDepth(): void {
  const thresholds = [25, 50, 75, 90],
    reached = new Set<number>();

  window.addEventListener('scroll', () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const depth = Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
    for (const threshold of thresholds) {
      if (depth >= threshold && !reached.has(threshold)) {
        reached.add(threshold);
        trackEvent('scroll_depth', { percent_scrolled: String(threshold) });
      }
    }
  }, { passive: true });
}

export function trackButtonClick(target: EventTarget | null): void {
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>('button[data-analytics-button]');
  if (button?.dataset.analyticsButton) trackEvent('button_click', { button_id: button.dataset.analyticsButton });
}
