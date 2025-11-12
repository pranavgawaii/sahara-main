import React from 'react';
import { cn } from '@/utils';

type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type SpacingSide = 'all' | 'x' | 'y' | 'top' | 'right' | 'bottom' | 'left';

interface SpacingProps extends React.HTMLAttributes<HTMLDivElement> {
  // Margin props
  m?: SpacingSize;
  mx?: SpacingSize;
  my?: SpacingSize;
  mt?: SpacingSize;
  mr?: SpacingSize;
  mb?: SpacingSize;
  ml?: SpacingSize;
  
  // Padding props
  p?: SpacingSize;
  px?: SpacingSize;
  py?: SpacingSize;
  pt?: SpacingSize;
  pr?: SpacingSize;
  pb?: SpacingSize;
  pl?: SpacingSize;
  
  // Responsive spacing
  responsive?: {
    sm?: Partial<Pick<SpacingProps, 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml' | 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl'>>;
    md?: Partial<Pick<SpacingProps, 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml' | 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl'>>;
    lg?: Partial<Pick<SpacingProps, 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml' | 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl'>>;
  };
}

const spacingValues = {
  none: '0',
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
  '3xl': '16',
  '4xl': '24',
};

const marginClasses = {
  m: (size: SpacingSize) => `m-${spacingValues[size]}`,
  mx: (size: SpacingSize) => `mx-${spacingValues[size]}`,
  my: (size: SpacingSize) => `my-${spacingValues[size]}`,
  mt: (size: SpacingSize) => `mt-${spacingValues[size]}`,
  mr: (size: SpacingSize) => `mr-${spacingValues[size]}`,
  mb: (size: SpacingSize) => `mb-${spacingValues[size]}`,
  ml: (size: SpacingSize) => `ml-${spacingValues[size]}`,
};

const paddingClasses = {
  p: (size: SpacingSize) => `p-${spacingValues[size]}`,
  px: (size: SpacingSize) => `px-${spacingValues[size]}`,
  py: (size: SpacingSize) => `py-${spacingValues[size]}`,
  pt: (size: SpacingSize) => `pt-${spacingValues[size]}`,
  pr: (size: SpacingSize) => `pr-${spacingValues[size]}`,
  pb: (size: SpacingSize) => `pb-${spacingValues[size]}`,
  pl: (size: SpacingSize) => `pl-${spacingValues[size]}`,
};

const responsiveMarginClasses = {
  sm: {
    m: (size: SpacingSize) => `sm:m-${spacingValues[size]}`,
    mx: (size: SpacingSize) => `sm:mx-${spacingValues[size]}`,
    my: (size: SpacingSize) => `sm:my-${spacingValues[size]}`,
    mt: (size: SpacingSize) => `sm:mt-${spacingValues[size]}`,
    mr: (size: SpacingSize) => `sm:mr-${spacingValues[size]}`,
    mb: (size: SpacingSize) => `sm:mb-${spacingValues[size]}`,
    ml: (size: SpacingSize) => `sm:ml-${spacingValues[size]}`,
  },
  md: {
    m: (size: SpacingSize) => `md:m-${spacingValues[size]}`,
    mx: (size: SpacingSize) => `md:mx-${spacingValues[size]}`,
    my: (size: SpacingSize) => `md:my-${spacingValues[size]}`,
    mt: (size: SpacingSize) => `md:mt-${spacingValues[size]}`,
    mr: (size: SpacingSize) => `md:mr-${spacingValues[size]}`,
    mb: (size: SpacingSize) => `md:mb-${spacingValues[size]}`,
    ml: (size: SpacingSize) => `md:ml-${spacingValues[size]}`,
  },
  lg: {
    m: (size: SpacingSize) => `lg:m-${spacingValues[size]}`,
    mx: (size: SpacingSize) => `lg:mx-${spacingValues[size]}`,
    my: (size: SpacingSize) => `lg:my-${spacingValues[size]}`,
    mt: (size: SpacingSize) => `lg:mt-${spacingValues[size]}`,
    mr: (size: SpacingSize) => `lg:mr-${spacingValues[size]}`,
    mb: (size: SpacingSize) => `lg:mb-${spacingValues[size]}`,
    ml: (size: SpacingSize) => `lg:ml-${spacingValues[size]}`,
  },
};

const responsivePaddingClasses = {
  sm: {
    p: (size: SpacingSize) => `sm:p-${spacingValues[size]}`,
    px: (size: SpacingSize) => `sm:px-${spacingValues[size]}`,
    py: (size: SpacingSize) => `sm:py-${spacingValues[size]}`,
    pt: (size: SpacingSize) => `sm:pt-${spacingValues[size]}`,
    pr: (size: SpacingSize) => `sm:pr-${spacingValues[size]}`,
    pb: (size: SpacingSize) => `sm:pb-${spacingValues[size]}`,
    pl: (size: SpacingSize) => `sm:pl-${spacingValues[size]}`,
  },
  md: {
    p: (size: SpacingSize) => `md:p-${spacingValues[size]}`,
    px: (size: SpacingSize) => `md:px-${spacingValues[size]}`,
    py: (size: SpacingSize) => `md:py-${spacingValues[size]}`,
    pt: (size: SpacingSize) => `md:pt-${spacingValues[size]}`,
    pr: (size: SpacingSize) => `md:pr-${spacingValues[size]}`,
    pb: (size: SpacingSize) => `md:pb-${spacingValues[size]}`,
    pl: (size: SpacingSize) => `md:pl-${spacingValues[size]}`,
  },
  lg: {
    p: (size: SpacingSize) => `lg:p-${spacingValues[size]}`,
    px: (size: SpacingSize) => `lg:px-${spacingValues[size]}`,
    py: (size: SpacingSize) => `lg:py-${spacingValues[size]}`,
    pt: (size: SpacingSize) => `lg:pt-${spacingValues[size]}`,
    pr: (size: SpacingSize) => `lg:pr-${spacingValues[size]}`,
    pb: (size: SpacingSize) => `lg:pb-${spacingValues[size]}`,
    pl: (size: SpacingSize) => `lg:pl-${spacingValues[size]}`,
  },
};

export const Spacing: React.FC<SpacingProps> = ({
  // Margin props
  m, mx, my, mt, mr, mb, ml,
  // Padding props
  p, px, py, pt, pr, pb, pl,
  // Responsive
  responsive,
  className,
  children,
  ...props
}) => {
  const classes = [];
  
  // Apply margin classes
  if (m) classes.push(marginClasses.m(m));
  if (mx) classes.push(marginClasses.mx(mx));
  if (my) classes.push(marginClasses.my(my));
  if (mt) classes.push(marginClasses.mt(mt));
  if (mr) classes.push(marginClasses.mr(mr));
  if (mb) classes.push(marginClasses.mb(mb));
  if (ml) classes.push(marginClasses.ml(ml));
  
  // Apply padding classes
  if (p) classes.push(paddingClasses.p(p));
  if (px) classes.push(paddingClasses.px(px));
  if (py) classes.push(paddingClasses.py(py));
  if (pt) classes.push(paddingClasses.pt(pt));
  if (pr) classes.push(paddingClasses.pr(pr));
  if (pb) classes.push(paddingClasses.pb(pb));
  if (pl) classes.push(paddingClasses.pl(pl));
  
  // Apply responsive classes
  if (responsive) {
    Object.entries(responsive).forEach(([breakpoint, config]) => {
      const bp = breakpoint as keyof typeof responsiveMarginClasses;
      
      Object.entries(config).forEach(([prop, size]) => {
        if (size && prop in responsiveMarginClasses[bp]) {
          classes.push(responsiveMarginClasses[bp][prop as keyof typeof responsiveMarginClasses[typeof bp]](size));
        }
        if (size && prop in responsivePaddingClasses[bp]) {
          classes.push(responsivePaddingClasses[bp][prop as keyof typeof responsivePaddingClasses[typeof bp]](size));
        }
      });
    });
  }

  return (
    <div
      className={cn(...classes, className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Convenience components for common spacing patterns
export const Section: React.FC<Omit<SpacingProps, 'py'> & { size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({
  size = 'lg',
  ...props
}) => {
  const sizeMap = {
    sm: 'lg' as const,
    md: 'xl' as const,
    lg: '2xl' as const,
    xl: '3xl' as const,
  };
  
  return <Spacing py={sizeMap[size]} {...props} />;
};

export const Card: React.FC<SpacingProps> = (props) => (
  <Spacing p="lg" className="glass-card" {...props} />
);

export const Divider: React.FC<{ size?: SpacingSize; className?: string }> = ({ 
  size = 'md', 
  className 
}) => (
  <Spacing my={size} className={cn('border-t border-border', className)} />
);