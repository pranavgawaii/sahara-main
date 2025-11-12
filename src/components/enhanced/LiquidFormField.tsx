import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/utils';
import { formFieldVariants, breathingVariants } from '@/utils/animations';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface LiquidFormFieldProps {
  type?: 'text' | 'textarea' | 'radio' | 'select';
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

const LiquidFormField: React.FC<LiquidFormFieldProps> = ({
  type = 'text',
  label,
  placeholder,
  value = '',
  onChange,
  options = [],
  error,
  required = false,
  className,
  id,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [2, -2]);
  const rotateY = useTransform(mouseX, [-100, 100], [-2, 2]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!inputRef.current) return;
    
    const rect = inputRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (value && value.trim().length > 0) {
      setIsValid(true);
    }
  };
  
  const handleChange = (newValue: string) => {
    onChange?.(newValue);
    if (newValue.trim().length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };
  
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <motion.div
            className="relative"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                'min-h-[120px] resize-none rounded-2xl border-2 bg-background/80 backdrop-blur-sm transition-all duration-300 focus:outline-none',
                isFocused && 'border-primary shadow-lg shadow-primary/20',
                error && 'border-destructive shadow-lg shadow-destructive/20',
                isValid && !error && 'border-success shadow-lg shadow-success/20'
              )}
            />
            
            {/* Floating particles on focus */}
            {isFocused && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/60 rounded-full pointer-events-none"
                    animate={{
                      x: [0, Math.random() * 40 - 20],
                      y: [0, Math.random() * 40 - 20],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      ease: 'easeOut',
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        );
        
      case 'radio':
        return (
          <RadioGroup
            value={value}
            onValueChange={handleChange}
            className="space-y-3"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.value}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`${id}_${option.value}`}
                    className="border-2 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  />
                  
                  {/* Ripple effect on selection */}
                  {value === option.value && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: 'easeOut',
                        repeat: Infinity,
                      }}
                    />
                  )}
                </motion.div>
                
                <Label
                  htmlFor={`${id}_${option.value}`}
                  className="cursor-pointer text-foreground hover:text-primary transition-colors"
                >
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        );
        
      default:
        return (
          <motion.div
            className="relative"
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              id={id}
              placeholder={placeholder}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                'w-full px-4 py-3 rounded-2xl border-2 bg-background/80 backdrop-blur-sm transition-all duration-300 focus:outline-none',
                isFocused && 'border-primary shadow-lg shadow-primary/20',
                error && 'border-destructive shadow-lg shadow-destructive/20',
                isValid && !error && 'border-success shadow-lg shadow-success/20'
              )}
            />
            
            {/* Glow effect */}
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 20px hsl(247 87% 63% / 0.2)',
                    '0 0 40px hsl(247 87% 63% / 0.3)',
                    '0 0 20px hsl(247 87% 63% / 0.2)',
                  ],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            )}
          </motion.div>
        );
    }
  };
  
  return (
    <motion.div
      className={cn('space-y-3', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Label */}
      <motion.div
        className="flex items-center gap-2"
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Label
          htmlFor={id}
          className={cn(
            'font-semibold transition-colors duration-300',
            isFocused && 'text-primary',
            error && 'text-destructive'
          )}
        >
          {label}
          {required && (
            <motion.span
              className="text-destructive ml-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              *
            </motion.span>
          )}
        </Label>
        
        {/* Validation icon */}
        {isValid && !error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <CheckCircle className="w-4 h-4 text-success" />
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <AlertCircle className="w-4 h-4 text-destructive" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Input field */}
      {renderInput()}
      
      {/* Error message */}
      {error && (
        <motion.p
          className="text-sm text-destructive flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="w-4 h-4" />
          </motion.div>
          {error}
        </motion.p>
      )}
      
      {/* Focus indicator */}
      {isFocused && (
        <motion.div
          className="h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          exit={{ width: '0%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
};

export default LiquidFormField;