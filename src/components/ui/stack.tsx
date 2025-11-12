import React from 'react';
import { cn } from '@/utils';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  responsive?: {
    sm?: {
      direction?: 'vertical' | 'horizontal';
      spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    };
    md?: {
      direction?: 'vertical' | 'horizontal';
      spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    };
    lg?: {
      direction?: 'vertical' | 'horizontal';
      spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    };
  };
}

const spacingMap = {
  vertical: {
    none: 'space-y-0',
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
  },
  horizontal: {
    none: 'space-x-0',
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12',
  },
};

const directionMap = {
  vertical: 'flex-col',
  horizontal: 'flex-row',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const responsiveSpacingMap = {
  sm: {
    vertical: {
      none: 'sm:space-y-0 sm:space-x-0',
      xs: 'sm:space-y-1 sm:space-x-0',
      sm: 'sm:space-y-2 sm:space-x-0',
      md: 'sm:space-y-4 sm:space-x-0',
      lg: 'sm:space-y-6 sm:space-x-0',
      xl: 'sm:space-y-8 sm:space-x-0',
      '2xl': 'sm:space-y-12 sm:space-x-0',
    },
    horizontal: {
      none: 'sm:space-x-0 sm:space-y-0',
      xs: 'sm:space-x-1 sm:space-y-0',
      sm: 'sm:space-x-2 sm:space-y-0',
      md: 'sm:space-x-4 sm:space-y-0',
      lg: 'sm:space-x-6 sm:space-y-0',
      xl: 'sm:space-x-8 sm:space-y-0',
      '2xl': 'sm:space-x-12 sm:space-y-0',
    },
  },
  md: {
    vertical: {
      none: 'md:space-y-0 md:space-x-0',
      xs: 'md:space-y-1 md:space-x-0',
      sm: 'md:space-y-2 md:space-x-0',
      md: 'md:space-y-4 md:space-x-0',
      lg: 'md:space-y-6 md:space-x-0',
      xl: 'md:space-y-8 md:space-x-0',
      '2xl': 'md:space-y-12 md:space-x-0',
    },
    horizontal: {
      none: 'md:space-x-0 md:space-y-0',
      xs: 'md:space-x-1 md:space-y-0',
      sm: 'md:space-x-2 md:space-y-0',
      md: 'md:space-x-4 md:space-y-0',
      lg: 'md:space-x-6 md:space-y-0',
      xl: 'md:space-x-8 md:space-y-0',
      '2xl': 'md:space-x-12 md:space-y-0',
    },
  },
  lg: {
    vertical: {
      none: 'lg:space-y-0 lg:space-x-0',
      xs: 'lg:space-y-1 lg:space-x-0',
      sm: 'lg:space-y-2 lg:space-x-0',
      md: 'lg:space-y-4 lg:space-x-0',
      lg: 'lg:space-y-6 lg:space-x-0',
      xl: 'lg:space-y-8 lg:space-x-0',
      '2xl': 'lg:space-y-12 lg:space-x-0',
    },
    horizontal: {
      none: 'lg:space-x-0 lg:space-y-0',
      xs: 'lg:space-x-1 lg:space-y-0',
      sm: 'lg:space-x-2 lg:space-y-0',
      md: 'lg:space-x-4 lg:space-y-0',
      lg: 'lg:space-x-6 lg:space-y-0',
      xl: 'lg:space-x-8 lg:space-y-0',
      '2xl': 'lg:space-x-12 lg:space-y-0',
    },
  },
};

const responsiveDirectionMap = {
  sm: {
    vertical: 'sm:flex-col',
    horizontal: 'sm:flex-row',
  },
  md: {
    vertical: 'md:flex-col',
    horizontal: 'md:flex-row',
  },
  lg: {
    vertical: 'lg:flex-col',
    horizontal: 'lg:flex-row',
  },
};

export const Stack: React.FC<StackProps> = ({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  responsive,
  className,
  children,
  ...props
}) => {
  const responsiveClasses = responsive
    ? Object.entries(responsive)
        .map(([breakpoint, config]) => {
          const bp = breakpoint as keyof typeof responsiveSpacingMap;
          const classes = [];
          
          if (config.direction) {
            classes.push(responsiveDirectionMap[bp][config.direction]);
          }
          
          if (config.spacing) {
            classes.push(responsiveSpacingMap[bp][config.direction || direction][config.spacing]);
          }
          
          return classes.join(' ');
        })
        .join(' ')
    : '';

  return (
    <div
      className={cn(
        'flex',
        directionMap[direction],
        spacingMap[direction][spacing],
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        responsiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Convenience components
export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack direction="vertical" {...props} />
);

export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack direction="horizontal" {...props} />
);