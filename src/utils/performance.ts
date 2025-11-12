import React, { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Performance optimization utilities
 * Provides code splitting, monitoring, memory management, and optimization tools
 */

/**
 * Code splitting utilities
 * Enables lazy loading of components to reduce initial bundle size
 */
/**
 * Create a lazy-loaded component with error handling
 * @param importFunc Dynamic import function for the component
 * @returns Lazy-loaded React component with error boundary
 */
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): LazyExoticComponent<T> => {
  return lazy(() => {
    return importFunc().catch((error) => {
      console.error('Failed to load component:', error);
      // Return a fallback component
      return {
        default: (() => {
          return React.createElement('div', 
            { className: 'p-4 text-center text-red-600' },
            React.createElement('p', null, 'Failed to load component. Please refresh the page.')
          );
        }) as unknown as T
      };
    });
  });
};

/**
 * Performance monitoring
 * Tracks Core Web Vitals and application performance metrics
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  /**
   * Get singleton instance of PerformanceMonitor
   * @returns PerformanceMonitor instance
   */
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Measure function execution time
   * @param name Metric name for tracking
   * @param fn Function to measure
   * @returns Wrapped function with performance tracking
   */
  measureFunction<T extends (...args: any[]) => any>(
    name: string,
    fn: T
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      this.recordMetric(name, end - start);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const asyncEnd = performance.now();
          this.recordMetric(`${name}_async`, asyncEnd - start);
        });
      }
      
      return result;
    }) as T;
  }

  /**
   * Record custom performance metric
   * @param name Metric name
   * @param value Metric value in milliseconds
   */
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Keep only last 100 measurements
    const values = this.metrics.get(name)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * Get performance statistics for a metric
   * @param name Metric name
   * @returns Statistics object or null if no data
   */
  getStats(name: string): {
    avg: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  /**
   * Start monitoring Core Web Vitals
   * Tracks LCP, FID, and CLS metrics
   */
  startCoreWebVitalsMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    });

    // First Input Delay (FID)
    this.observePerformanceEntries('first-input', (entries) => {
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime);
      });
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntries('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.recordMetric('CLS', clsValue);
    });
  }

  private observePerformanceEntries(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.set(entryType, observer);
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  /**
   * Clean up performance observers
   * Call this to prevent memory leaks
   */
  cleanup(): void {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
  }
}

/**
 * Memory management utilities
 * Monitors memory usage and helps prevent memory leaks
 */
export class MemoryManager {
  private static cleanupTasks: Set<() => void> = new Set();
  private static memoryWarningThreshold = 50 * 1024 * 1024; // 50MB

  /**
   * Add a cleanup task to be executed during memory cleanup
   * @param task Function to execute during cleanup
   */
  static addCleanupTask(task: () => void): void {
    this.cleanupTasks.add(task);
  }

  /**
   * Remove a cleanup task
   * @param task Function to remove from cleanup tasks
   */
  static removeCleanupTask(task: () => void): void {
    this.cleanupTasks.delete(task);
  }

  /**
   * Execute all registered cleanup tasks
   */
  static runCleanup(): void {
    this.cleanupTasks.forEach((task) => {
      try {
        task();
      } catch (error) {
        console.error('Cleanup task failed:', error);
      }
    });
  }

  /**
   * Get current memory usage statistics
   * @returns Memory usage object or null if not supported
   */
  static getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } | null {
    if (!('memory' in performance)) return null;

    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    };
  }

  /**
   * Start automatic memory monitoring
   * Checks memory usage periodically and triggers cleanup when needed
   */
  static startMemoryMonitoring(): void {
    if (typeof window === 'undefined') return;

    const checkMemory = () => {
      const usage = this.getMemoryUsage();
      if (usage && usage.used > this.memoryWarningThreshold) {
        console.warn('High memory usage detected:', usage);
        this.runCleanup();
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);

    // Also check on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkMemory();
      }
    });
  }
}

/**
 * Image optimization utilities
 * Provides image caching, preloading, and optimization features
 */
export const createOptimizedImageLoader = () => {
  const imageCache = new Map<string, HTMLImageElement>();
  const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    // Return cached image if available
    if (imageCache.has(src)) {
      return Promise.resolve(imageCache.get(src)!);
    }

    // Return existing loading promise if in progress
    if (loadingPromises.has(src)) {
      return loadingPromises.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        imageCache.set(src, img);
        loadingPromises.delete(src);
        resolve(img);
      };
      
      img.onerror = () => {
        loadingPromises.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });

    loadingPromises.set(src, promise);
    return promise;
  };

  const preloadImages = (urls: string[]): Promise<HTMLImageElement[]> => {
    return Promise.all(urls.map(loadImage));
  };

  const clearCache = (): void => {
    imageCache.clear();
    loadingPromises.clear();
  };

  return { loadImage, preloadImages, clearCache };
};

/**
 * Custom debounce implementation
 * Delays function execution until after delay time has elapsed since last call
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

/**
 * Custom throttle implementation
 * Limits function execution to once per specified time period
 */
const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let lastCall = 0;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  }) as T;
};

/**
 * Debounced and throttled utilities
 * Factory functions for creating optimized callback functions
 */

/**
 * Create a debounced callback function
 * @param callback Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced callback function
 */
export const createDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  return debounce(callback, delay);
};

/**
 * Create a throttled callback function
 * @param callback Function to throttle
 * @param delay Time limit in milliseconds
 * @returns Throttled callback function
 */
export const createThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  return throttle(callback, delay);
};

/**
 * Virtual scrolling utilities
 * Optimizes rendering of large lists by only rendering visible items
 */
export class VirtualScrollManager {
  private containerHeight: number;
  private itemHeight: number;
  private totalItems: number;
  private overscan: number;

  constructor(
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan: number = 5
  ) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.overscan = overscan;
  }

  /**
   * Calculate which items should be visible in the viewport
   * @param scrollTop Current scroll position
   * @returns Object with start/end indices and offset
   */
  getVisibleRange(scrollTop: number): {
    start: number;
    end: number;
    offsetY: number;
  } {
    const visibleStart = Math.floor(scrollTop / this.itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(this.containerHeight / this.itemHeight),
      this.totalItems - 1
    );

    const start = Math.max(0, visibleStart - this.overscan);
    const end = Math.min(this.totalItems - 1, visibleEnd + this.overscan);

    return {
      start,
      end,
      offsetY: start * this.itemHeight
    };
  }

  /**
   * Get total height of all items
   * @returns Total height in pixels
   */
  getTotalHeight(): number {
    return this.totalItems * this.itemHeight;
  }

  /**
   * Update the height of individual items
   * @param newHeight New item height in pixels
   */
  updateItemHeight(newHeight: number): void {
    this.itemHeight = newHeight;
  }

  /**
   * Update the total number of items
   * @param newTotal New total item count
   */
  updateTotalItems(newTotal: number): void {
    this.totalItems = newTotal;
  }
}

/**
 * Bundle analysis utilities
 * Monitors and analyzes JavaScript bundle loading performance
 */
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return null;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

  const getResourceSize = async (url: string): Promise<number> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch {
      return 0;
    }
  };

  const analyzeResources = async () => {
    const scriptSizes = await Promise.all(
      scripts.map(async (script) => {
        const src = (script as HTMLScriptElement).src;
        const size = await getResourceSize(src);
        return { url: src, size, type: 'script' };
      })
    );

    const stylesheetSizes = await Promise.all(
      stylesheets.map(async (link) => {
        const href = (link as HTMLLinkElement).href;
        const size = await getResourceSize(href);
        return { url: href, size, type: 'stylesheet' };
      })
    );

    return [...scriptSizes, ...stylesheetSizes];
  };

  return { analyzeResources };
};

/**
 * Initialize comprehensive performance monitoring
 * Sets up all performance tracking and monitoring systems
 * @returns PerformanceMonitor instance for cleanup
 */
export const initializePerformanceMonitoring = () => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startCoreWebVitalsMonitoring();
  MemoryManager.startMemoryMonitoring();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    monitor.cleanup();
    MemoryManager.runCleanup();
  });

  return monitor;
};