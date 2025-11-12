import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/utils';
import { buttonVariants, rippleVariants } from '@/utils/animations';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ambient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    
    onClick?.();
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-primary-soft text-primary-foreground hover:from-primary-soft hover:to-primary';
      case 'secondary':
        return 'bg-gradient-to-r from-accent to-accent-soft text-accent-foreground hover:from-accent-soft hover:to-accent';
      case 'ambient':
        return 'bg-gradient-to-r from-primary/10 to-accent/10 text-foreground border border-primary/20 hover:border-primary/40';
      default:
        return 'bg-gradient-to-r from-primary to-primary-soft text-primary-foreground';
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };
  
  return (
    <motion.button
      ref={buttonRef}
      type={type}
      className={cn(
        'relative overflow-hidden rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20',
        getVariantClasses(),
        getSizeClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      variants={buttonVariants}
      initial="initial"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      animate={disabled ? "disabled" : "initial"}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Liquid background effect */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, hsl(247 87% 63% / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, hsl(201 100% 70% / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, hsl(247 87% 63% / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, hsl(201 100% 70% / 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, hsl(247 87% 63% / 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          variants={rippleVariants}
          initial="initial"
          animate="animate"
        />
      ))}
      
      {/* Button content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          scale: isClicked ? 0.95 : 1,
        }}
        transition={{
          duration: 0.1,
          ease: 'easeOut',
        }}
      >
        {children}
      </motion.span>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{
          background: 'radial-gradient(circle, hsl(247 87% 63% / 0.2) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
    </motion.button>
  );
};

export default LiquidButton;