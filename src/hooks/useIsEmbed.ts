import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useIsEmbed() {
  const location = useLocation();
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check if URL has embed parameter or if it's running inside an iframe
    const hasEmbedParam = params.get('embed') === 'true';
    const isIframe = window.self !== window.top;
    
    setIsEmbed(hasEmbedParam || isIframe);
  }, [location]);

  return { isEmbed };
}
