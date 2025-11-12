import React from 'react';
import { cn } from '@/utils';
import { APP_CONFIG } from '@/constants';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      "bg-card/80 backdrop-blur-md border-t border-border/50",
      "px-4 lg:px-6 py-4",
      "shadow-soft",
      className
    )}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">WB</span>
          </div>
          <span className="text-sm text-muted-foreground">
            © {currentYear} {APP_CONFIG.name}. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <a 
            href="/privacy" 
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="/terms" 
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="/contact" 
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};