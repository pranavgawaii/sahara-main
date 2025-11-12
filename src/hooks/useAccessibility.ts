import { useEffect, useRef, useState, useCallback } from 'react';
import { useUIStore } from '../stores';

// Screen reader announcements
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
};

// Focus management
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      element.focus();
      focusRef.current = element;
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, []);

  return { setFocus, restoreFocus, trapFocus, focusRef };
};

// Keyboard navigation
export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((e: KeyboardEvent, actions: Record<string, () => void>) => {
    const action = actions[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  }, []);

  const useArrowNavigation = (items: HTMLElement[], currentIndex: number, setCurrentIndex: (index: number) => void) => {
    useEffect(() => {
      const handleArrowKeys = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault();
            setCurrentIndex((currentIndex + 1) % items.length);
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault();
            setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
            break;
          case 'Home':
            e.preventDefault();
            setCurrentIndex(0);
            break;
          case 'End':
            e.preventDefault();
            setCurrentIndex(items.length - 1);
            break;
        }
      };

      document.addEventListener('keydown', handleArrowKeys);
      return () => document.removeEventListener('keydown', handleArrowKeys);
    }, [items, currentIndex, setCurrentIndex]);
  };

  return { handleKeyDown, useArrowNavigation };
};

// Reduced motion preferences
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// High contrast mode detection
export const useHighContrast = () => {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return highContrast;
};

// Color blindness support
export const useColorBlindness = () => {
  const { preferences, setPreferences } = useUIStore();
  
  const colorBlindnessFilters = {
    none: '',
    protanopia: 'url(#protanopia-filter)',
    deuteranopia: 'url(#deuteranopia-filter)',
    tritanopia: 'url(#tritanopia-filter)',
    achromatopsia: 'url(#achromatopsia-filter)'
  };

  const setColorBlindnessFilter = useCallback((filter: keyof typeof colorBlindnessFilters) => {
    setPreferences({ colorBlindnessFilter: filter });
    document.documentElement.style.filter = colorBlindnessFilters[filter];
  }, [setPreferences]);

  useEffect(() => {
    if (preferences.colorBlindnessFilter) {
      document.documentElement.style.filter = colorBlindnessFilters[preferences.colorBlindnessFilter];
    }
  }, [preferences.colorBlindnessFilter]);

  return { setColorBlindnessFilter, currentFilter: preferences.colorBlindnessFilter };
};

// Text scaling
export const useTextScaling = () => {
  const { preferences, setPreferences } = useUIStore();
  
  const textScales = {
    small: '0.875',
    normal: '1',
    large: '1.125',
    'extra-large': '1.25',
    huge: '1.5'
  };

  const setTextScale = useCallback((scale: keyof typeof textScales) => {
    setPreferences({ textScale: scale });
    document.documentElement.style.fontSize = `${textScales[scale]}rem`;
  }, [setPreferences]);

  useEffect(() => {
    if (preferences.textScale) {
      document.documentElement.style.fontSize = `${textScales[preferences.textScale]}rem`;
    }
  }, [preferences.textScale]);

  return { setTextScale, currentScale: preferences.textScale, textScales };
};

// Skip links
export const useSkipLinks = () => {
  const skipToContent = useCallback(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const skipToNavigation = useCallback(() => {
    const navigation = document.getElementById('main-navigation');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { skipToContent, skipToNavigation };
};

// ARIA live regions
export const useLiveRegion = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  const updateLiveRegion = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
    }
  }, []);

  const clearLiveRegion = useCallback(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
    }
  }, []);

  return { liveRegionRef, updateLiveRegion, clearLiveRegion };
};

// Form accessibility
export const useFormAccessibility = () => {
  const validateField = useCallback((field: HTMLInputElement, rules: any) => {
    const errors: string[] = [];
    
    if (rules.required && !field.value.trim()) {
      errors.push('This field is required');
    }
    
    if (rules.minLength && field.value.length < rules.minLength) {
      errors.push(`Minimum length is ${rules.minLength} characters`);
    }
    
    if (rules.pattern && !rules.pattern.test(field.value)) {
      errors.push(rules.patternMessage || 'Invalid format');
    }
    
    // Update ARIA attributes
    if (errors.length > 0) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', `${field.id}-error`);
    } else {
      field.setAttribute('aria-invalid', 'false');
      field.removeAttribute('aria-describedby');
    }
    
    return errors;
  }, []);

  const announceFormErrors = useCallback((errors: Record<string, string[]>) => {
    const { announce } = useScreenReader();
    const errorCount = Object.values(errors).flat().length;
    
    if (errorCount > 0) {
      announce(
        `Form submission failed. ${errorCount} error${errorCount > 1 ? 's' : ''} found. Please review and correct the highlighted fields.`,
        'assertive'
      );
    }
  }, []);

  return { validateField, announceFormErrors };
};