import { Variants, Transition } from 'framer-motion';

// Enhanced animation variants for questionnaire components
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    filter: 'blur(10px)',
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Liquid ether effect variants
export const liquidEtherVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
    borderRadius: '50%',
    background: 'linear-gradient(45deg, hsl(247 87% 63% / 0.1), hsl(201 100% 70% / 0.1))',
  },
  animate: {
    scale: [0.8, 1.2, 1],
    opacity: [0, 0.8, 1],
    borderRadius: ['50%', '30%', '20%'],
    background: [
      'linear-gradient(45deg, hsl(247 87% 63% / 0.1), hsl(201 100% 70% / 0.1))',
      'linear-gradient(135deg, hsl(247 87% 63% / 0.2), hsl(201 100% 70% / 0.15))',
      'linear-gradient(225deg, hsl(247 87% 63% / 0.15), hsl(201 100% 70% / 0.1))',
    ],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

// Button interaction variants
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 4px 12px hsl(220 26% 14% / 0.08)',
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 8px 32px hsl(247 87% 63% / 0.25)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: 'easeOut',
    },
  },
  disabled: {
    scale: 1,
    opacity: 0.6,
    boxShadow: '0 2px 8px hsl(220 26% 14% / 0.04)',
  },
};

// Card interaction variants
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    rotateX: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    y: -8,
    rotateX: 5,
    boxShadow: '0 20px 60px hsl(247 87% 63% / 0.15)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Form field variants
export const formFieldVariants: Variants = {
  initial: {
    borderColor: 'hsl(220 14% 85%)',
    boxShadow: '0 0 0 0 hsl(247 87% 63% / 0)',
  },
  focus: {
    borderColor: 'hsl(247 87% 63%)',
    boxShadow: '0 0 0 3px hsl(247 87% 63% / 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  error: {
    borderColor: 'hsl(0 72% 51%)',
    boxShadow: '0 0 0 3px hsl(0 72% 51% / 0.1)',
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

// Progress indicator variants
export const progressVariants: Variants = {
  initial: {
    width: '0%',
    opacity: 0,
  },
  animate: {
    width: '100%',
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Floating elements variants
export const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    x: [-5, 5, -5],
    rotate: [-2, 2, -2],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

// Stagger container variants
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Smooth transitions
export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const gentleTransition: Transition = {
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// Cursor tracking utilities
export const createCursorTracker = () => {
  let mouseX = 0;
  let mouseY = 0;
  
  const updateMousePosition = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };
  
  const getCursorPosition = () => ({ x: mouseX, y: mouseY });
  
  return {
    updateMousePosition,
    getCursorPosition,
  };
};

// Liquid morphing effect
export const liquidMorphVariants: Variants = {
  morph: {
    borderRadius: [
      '60% 40% 30% 70%/60% 30% 70% 40%',
      '30% 60% 70% 40%/50% 60% 30% 60%',
      '40% 60% 60% 40%/60% 40% 60% 40%',
      '60% 40% 30% 70%/60% 30% 70% 40%',
    ],
    transition: {
      duration: 8,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Breathing animation for focus states
export const breathingVariants: Variants = {
  breathe: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Ripple effect for button clicks
export const rippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0.8,
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};