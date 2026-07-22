import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Emits a virtual_page_view on every React Router location change
 * so GTM can fire GA4 page_view tags in this SPA.
 */
export default function AnalyticsPageViews() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    trackPageView(path);
  }, [location.pathname, location.search]);

  return null;
}
