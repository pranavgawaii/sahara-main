import React from 'react';
import { cn } from '@/utils';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'destructive';
  align?: 'left' | 'center' | 'right' | 'justify';
  font?: 'inter' | 'playfair';
  truncate?: boolean;
  responsive?: {
    sm?: {
      size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
      align?: 'left' | 'center' | 'right' | 'justify';
    };
    md?: {
      size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
      align?: 'left' | 'center' | 'right' | 'justify';
    };
    lg?: {
      size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
      align?: 'left' | 'center' | 'right' | 'justify';
    };
  };
}

const sizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
};

const weightMap = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorMap = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
};

const alignMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const fontMap = {
  inter: 'font-inter',
  playfair: 'font-playfair',
};

const responsiveSizeMap = {
  sm: {
    xs: 'sm:text-xs',
    sm: 'sm:text-sm',
    base: 'sm:text-base',
    lg: 'sm:text-lg',
    xl: 'sm:text-xl',
    '2xl': 'sm:text-2xl',
    '3xl': 'sm:text-3xl',
    '4xl': 'sm:text-4xl',
    '5xl': 'sm:text-5xl',
    '6xl': 'sm:text-6xl',
  },
  md: {
    xs: 'md:text-xs',
    sm: 'md:text-sm',
    base: 'md:text-base',
    lg: 'md:text-lg',
    xl: 'md:text-xl',
    '2xl': 'md:text-2xl',
    '3xl': 'md:text-3xl',
    '4xl': 'md:text-4xl',
    '5xl': 'md:text-5xl',
    '6xl': 'md:text-6xl',
  },
  lg: {
    xs: 'lg:text-xs',
    sm: 'lg:text-sm',
    base: 'lg:text-base',
    lg: 'lg:text-lg',
    xl: 'lg:text-xl',
    '2xl': 'lg:text-2xl',
    '3xl': 'lg:text-3xl',
    '4xl': 'lg:text-4xl',
    '5xl': 'lg:text-5xl',
    '6xl': 'lg:text-6xl',
  },
};

const responsiveAlignMap = {
  sm: {
    left: 'sm:text-left',
    center: 'sm:text-center',
    right: 'sm:text-right',
    justify: 'sm:text-justify',
  },
  md: {
    left: 'md:text-left',
    center: 'md:text-center',
    right: 'md:text-right',
    justify: 'md:text-justify',
  },
  lg: {
    left: 'lg:text-left',
    center: 'lg:text-center',
    right: 'lg:text-right',
    justify: 'lg:text-justify',
  },
};

// Default semantic styling for heading elements
const headingDefaults = {
  h1: { size: '4xl' as const, weight: 'bold' as const, font: 'playfair' as const },
  h2: { size: '3xl' as const, weight: 'semibold' as const, font: 'playfair' as const },
  h3: { size: '2xl' as const, weight: 'semibold' as const, font: 'inter' as const },
  h4: { size: 'xl' as const, weight: 'semibold' as const, font: 'inter' as const },
  h5: { size: 'lg' as const, weight: 'medium' as const, font: 'inter' as const },
  h6: { size: 'base' as const, weight: 'medium' as const, font: 'inter' as const },
};

export const Text: React.FC<TextProps> = ({
  as = 'p',
  size,
  weight,
  color = 'default',
  align = 'left',
  font = 'inter',
  truncate = false,
  responsive,
  className,
  children,
  ...props
}) => {
  const Component = as;
  
  // Apply semantic defaults for headings if not overridden
  const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as);
  const defaults = isHeading ? headingDefaults[as as keyof typeof headingDefaults] : {
    size: 'base' as const,
    weight: 'normal' as const,
    font: 'inter' as const
  };
  
  const finalSize = size || defaults.size;
  const finalWeight = weight || defaults.weight;
  const finalFont = font || defaults.font;
  
  const responsiveClasses = responsive
    ? Object.entries(responsive)
        .map(([breakpoint, config]) => {
          const bp = breakpoint as keyof typeof responsiveSizeMap;
          const classes = [];
          
          if (config.size) {
            classes.push(responsiveSizeMap[bp][config.size]);
          }
          
          if (config.align) {
            classes.push(responsiveAlignMap[bp][config.align]);
          }
          
          return classes.join(' ');
        })
        .join(' ')
    : '';

  return (
    <Component
      className={cn(
        sizeMap[finalSize],
        weightMap[finalWeight],
        colorMap[color],
        alignMap[align],
        fontMap[finalFont],
        truncate && 'truncate',
        isHeading && 'leading-tight',
        !isHeading && 'leading-relaxed',
        responsiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Convenience components for common use cases
export const Heading: React.FC<Omit<TextProps, 'as'> & { level: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  level,
  ...props
}) => {
  const as = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return <Text as={as} {...props} />;
};

export const Paragraph: React.FC<Omit<TextProps, 'as'>> = (props) => (
  <Text as="p" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'as' | 'size' | 'color'>> = (props) => (
  <Text as="span" size="sm" color="muted" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'>> = (props) => (
  <Text as="span" size="sm" weight="medium" {...props} />
);