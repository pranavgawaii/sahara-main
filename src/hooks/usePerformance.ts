import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { 
  PerformanceMonitor, 
  MemoryManager, 
  createDebouncedCallback, 
  createThrottledCallback,
  VirtualScrollManager 
} from '../utils/performance';

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = useMemo(() => PerformanceMonitor.getInstance(), []);
  const [metrics, setMetrics] = useState<Record<string, any>>({});

  const measureFunction = useCallback(
    <T extends (...args: any[]) => any>(name: string, fn: T): T => {
      return monitor.measureFunction(name, fn);
    },
    [monitor]
  );

  const recordMetric = useCallback(
    (name: string, value: number) => {
      monitor.recordMetric(name, value);
    },
    [monitor]
  );

  const getStats = useCallback(
    (name: string) => {
      return monitor.getStats(name);
    },
    [monitor]
  );

  const updateMetrics = useCallback(() => {
    const coreMetrics = {
      LCP: monitor.getStats('LCP'),
      FID: monitor.getStats('FID'),
      CLS: monitor.getStats('CLS')
    };
    setMetrics(coreMetrics);
  }, [monitor]);

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return {
    measureFunction,
    recordMetric,
    getStats,
    metrics
  };
};

// Hook for memory management
export const useMemoryManager = () => {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    percentage: number;
  } | null>(null);

  const addCleanupTask = useCallback((task: () => void) => {
    MemoryManager.addCleanupTask(task);
    return () => MemoryManager.removeCleanupTask(task);
  }, []);

  const runCleanup = useCallback(() => {
    MemoryManager.runCleanup();
  }, []);

  const updateMemoryUsage = useCallback(() => {
    const usage = MemoryManager.getMemoryUsage();
    setMemoryUsage(usage);
  }, []);

  useEffect(() => {
    // Update memory usage every 10 seconds
    const interval = setInterval(updateMemoryUsage, 10000);
    updateMemoryUsage(); // Initial update
    return () => clearInterval(interval);
  }, [updateMemoryUsage]);

  return {
    memoryUsage,
    addCleanupTask,
    runCleanup
  };
};

// Hook for debounced callbacks
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  return useMemo(
    () => createDebouncedCallback(callback, delay),
    [delay, ...deps]
  );
};

// Hook for throttled callbacks
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  return useMemo(
    () => createThrottledCallback(callback, delay),
    [delay, ...deps]
  );
};

// Hook for virtual scrolling
export const useVirtualScroll = ({
  containerHeight,
  itemHeight,
  totalItems,
  overscan = 5
}: {
  containerHeight: number;
  itemHeight: number;
  totalItems: number;
  overscan?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const virtualScrollManager = useMemo(
    () => new VirtualScrollManager(containerHeight, itemHeight, totalItems, overscan),
    [containerHeight, itemHeight, totalItems, overscan]
  );

  const visibleRange = useMemo(
    () => virtualScrollManager.getVisibleRange(scrollTop),
    [virtualScrollManager, scrollTop]
  );

  const totalHeight = useMemo(
    () => virtualScrollManager.getTotalHeight(),
    [virtualScrollManager]
  );

  const handleScroll = useThrottle(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    },
    16 // ~60fps
  );

  return {
    scrollElementRef,
    visibleRange,
    totalHeight,
    handleScroll,
    scrollTop
  };
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true
}: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        setIsIntersecting(isCurrentlyIntersecting);
        
        if (isCurrentlyIntersecting && !hasIntersected) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasIntersected]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected
  };
};

// Hook for image lazy loading
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (!isIntersecting || isLoaded || isError) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
    };
    
    img.src = src;
  }, [src, isIntersecting, isLoaded, isError]);

  return {
    elementRef,
    imageSrc,
    isLoaded,
    isError
  };
};

// Hook for component render tracking
export const useRenderTracker = (componentName: string) => {
  const renderCount = useRef(0);
  const { measureFunction } = usePerformanceMonitor();

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });

  const trackFunction = useCallback(
    <T extends (...args: any[]) => any>(name: string, fn: T): T => {
      return measureFunction(`${componentName}_${name}`, fn);
    },
    [componentName, measureFunction]
  );

  return {
    renderCount: renderCount.current,
    trackFunction
  };
};

// Hook for preventing unnecessary re-renders
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    []
  );
};

// Hook for batch state updates
export const useBatchedState = <T>(
  initialState: T
): [T, (updater: (prevState: T) => T) => void] => {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<((prevState: T) => T)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const batchedSetState = useCallback((updater: (prevState: T) => T) => {
    pendingUpdates.current.push(updater);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState(prevState => {
        let newState = prevState;
        pendingUpdates.current.forEach(update => {
          newState = update(newState);
        });
        pendingUpdates.current = [];
        return newState;
      });
      timeoutRef.current = null;
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchedSetState];
};

// Hook for component size tracking
export const useElementSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, []);

  return {
    elementRef,
    size
  };
};