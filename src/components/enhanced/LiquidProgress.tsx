import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { progressVariants, liquidMorphVariants } from '@/utils/animations';

interface LiquidProgressProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'liquid';
}

const LiquidProgress: React.FC<LiquidProgressProps> = ({
  value,
  max = 100,
  className,
  showPercentage = true,
  animated = true,
  size = 'md',
  variant = 'liquid',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'md':
        return 'h-3';
      case 'lg':
        return 'h-4';
      default:
        return 'h-3';
    }
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'default':
        return 'bg-primary';
      case 'gradient':
        return 'bg-gradient-to-r from-primary via-accent to-primary-soft';
      case 'liquid':
        return 'bg-gradient-to-r from-primary via-accent to-primary-soft';
      default:
        return 'bg-gradient-to-r from-primary via-accent to-primary-soft';
    }
  };
  
  return (
    <div className={cn('relative w-full', className)}>
      {/* Progress container */}
      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-muted/20 backdrop-blur-sm',
          getSizeClasses()
        )}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at left, hsl(247 87% 63% / 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at center, hsl(201 100% 70% / 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at right, hsl(247 87% 63% / 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
        
        {/* Progress fill */}
        <motion.div
          className={cn(
            'relative h-full rounded-full',
            getVariantClasses()
          )}
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Liquid morphing effect */}
          {variant === 'liquid' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              variants={liquidMorphVariants}
              animate="morph"
            />
          )}
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              width: '50%',
            }}
          />
          
          {/* Floating particles */}
          {animated && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
        
        {/* Progress indicator dot */}
        <motion.div
          className="absolute top-1/2 w-2 h-2 bg-white rounded-full shadow-lg transform -translate-y-1/2"
          animate={{
            left: `${percentage}%`,
            x: '-50%',
          }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Dot glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
      
      {/* Percentage display */}
      {showPercentage && (
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.span
            className="text-sm font-semibold text-foreground"
            animate={{
              scale: percentage > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            {Math.round(percentage)}%
          </motion.span>
          <span className="text-xs text-muted-foreground ml-1">complete</span>
        </motion.div>
      )}
      
      {/* Ambient background effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full opacity-20"
        animate={{
          background: [
            'radial-gradient(ellipse at center, hsl(247 87% 63% / 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at center, hsl(201 100% 70% / 0.1) 0%, transparent 70%)',
            'radial-gradient(ellipse at center, hsl(247 87% 63% / 0.1) 0%, transparent 70%)',
          ],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </div>
  );
};

export default LiquidProgress;