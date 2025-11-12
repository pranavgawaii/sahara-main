import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/constants';

/**
 * Hook to detect if the current viewport is mobile size
 * @returns boolean indicating if the viewport is mobile
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

/**
 * Hook to get current viewport width
 * @returns current window width
 */
export const useViewportWidth = (): number => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

/**
 * Hook to detect specific breakpoints
 * @returns object with boolean flags for different breakpoints
 */
export const useBreakpoints = () => {
  const [breakpoints, setBreakpoints] = useState({
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setBreakpoints({
        isSm: width >= BREAKPOINTS.sm,
        isMd: width >= BREAKPOINTS.md,
        isLg: width >= BREAKPOINTS.lg,
        isXl: width >= BREAKPOINTS.xl,
        is2Xl: width >= BREAKPOINTS['2xl'],
      });
    };

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    
    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  return breakpoints;
};