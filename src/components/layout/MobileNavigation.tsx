import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils';
import { useStore } from '@/stores/useStore';
import { ROUTES } from '@/constants';
import {
  LayoutDashboard,
  MessageCircle,
  Calendar,
  BookOpen,
  TrendingUp,
  Home,
  User
} from 'lucide-react';

interface MobileNavigationProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mobileNavItems: NavItem[] = [
  {
    title: 'Home',
    href: ROUTES.dashboard,
    icon: Home,
  },
  {
    title: 'Chat',
    href: ROUTES.chat,
    icon: MessageCircle,
    badge: 'AI',
  },
  {
    title: 'Tracker',
    href: ROUTES.tracker,
    icon: TrendingUp,
  },
  {
    title: 'Book',
    href: ROUTES.booking,
    icon: Calendar,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student } = useStore();

  if (!student) {
    return null;
  }

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-card/95 backdrop-blur-md border-t border-border/50",
      "px-2 py-2 safe-area-pb",
      "shadow-soft",
      className
    )}>
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.href)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3 relative",
                "hover:bg-accent hover:text-accent-foreground",
                "transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                {item.badge && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"}
                    className="absolute -top-2 -right-2 text-xs px-1 py-0 h-4 min-w-4 flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.title}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b" />
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};