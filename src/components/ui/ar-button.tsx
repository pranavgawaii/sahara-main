import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ARButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ARButton: React.FC<ARButtonProps> = ({
  onClick,
  disabled = false,
  className,
  children,
  variant = 'outline',
  size = 'sm'
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'relative overflow-hidden group',
          'bg-gradient-to-r from-purple-50 to-blue-50',
          'border-purple-200 hover:from-purple-100 hover:to-blue-100',
          'text-purple-700 hover:text-purple-800',
          'transition-all duration-300',
          'shadow-sm hover:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        
        {/* Content */}
        <div className="relative flex items-center gap-2 z-10">
          <div className="relative">
            <Eye className="w-4 h-4" />
            {/* Sparkle effect */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Sparkles className="w-2 h-2 text-purple-500" />
            </motion.div>
          </div>
          
          {children || 'AR Interaction'}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    </motion.div>
  );
};

export default ARButton;