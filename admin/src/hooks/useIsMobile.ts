import { useState, useEffect } from 'react';

/**
 * Hook pentru detectarea dispozitivelor mobile (< 1024px)
 * Folosește window.innerWidth direct pentru performanță maximă
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Ascultă resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
