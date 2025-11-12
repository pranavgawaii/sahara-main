import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils';
import { useStore } from '@/stores/useStore';
import { ROUTES, APP_CONFIG } from '@/constants';
import {
  LayoutDashboard,
  MessageCircle,
  Calendar,
  BookOpen,
  TrendingUp,
  Settings,
  HelpCircle,
  Heart,
  Brain,
  Activity,
  Users,
  FileText,
  Shield,
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    description: 'Overview and quick actions'
  },
  {
    title: 'Chat Support',
    href: ROUTES.chat,
    icon: MessageCircle,
    badge: 'AI',
    description: 'Talk to our AI counselor'
  },
  {
    title: 'Mood Tracker',
    href: ROUTES.tracker,
    icon: TrendingUp,
    description: 'Track your emotional wellbeing'
  },
  {
    title: 'Book Session',
    href: ROUTES.booking,
    icon: Calendar,
    description: 'Schedule with a counselor'
  },
  {
    title: 'Resources',
    href: ROUTES.resources,
    icon: BookOpen,
    description: 'Self-help materials and guides'
  },
];

const wellbeingNavItems: NavItem[] = [
  {
    title: 'Mental Health',
    href: '/mental-health',
    icon: Brain,
    description: 'Mental health resources'
  },
  {
    title: 'Physical Wellness',
    href: '/physical-wellness',
    icon: Activity,
    description: 'Physical health and fitness'
  },
  {
    title: 'Emotional Support',
    href: '/emotional-support',
    icon: Heart,
    description: 'Emotional wellbeing tools'
  },
];

const supportNavItems: NavItem[] = [
  {
    title: 'Community',
    href: '/community',
    icon: Users,
    description: 'Connect with peers'
  },
  {
    title: 'Crisis Support',
    href: '/crisis',
    icon: Shield,
    badge: '24/7',
    description: 'Emergency mental health support'
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Your progress reports'
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    description: 'View your profile and ID'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account and preferences'
  },
  {
    title: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    description: 'Get help and support'
  },
  {
    title: 'Logout',
    href: '/logout',
    icon: LogOut,
    description: 'Sign out of your account'
  },
];

interface NavSectionProps {
  title: string;
  items: NavItem[];
  currentPath: string;
}

const NavSection: React.FC<NavSectionProps> = ({ title, items, currentPath }) => {
  return (
    <div className="space-y-2">
      <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                "group relative",
                isActive 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
              )} />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? "default" : "secondary"}
                  className="text-xs px-1.5 py-0.5 h-5"
                >
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const { student } = useStore();

  if (!student) {
    return null;
  }

  return (
    <div className={cn(
      "flex h-full w-64 flex-col bg-card border-r border-border",
      "shadow-soft",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link 
          to={ROUTES.dashboard}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">WB</span>
          </div>
          <span className="font-semibold text-foreground">
            {APP_CONFIG.name}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4 px-2">
        <div className="space-y-6">
          <NavSection 
            title="Main" 
            items={mainNavItems} 
            currentPath={location.pathname} 
          />
          
          <Separator className="mx-3" />
          
          <NavSection 
            title="Wellbeing" 
            items={wellbeingNavItems} 
            currentPath={location.pathname} 
          />
          
          <Separator className="mx-3" />
          
          <NavSection 
            title="Support" 
            items={supportNavItems} 
            currentPath={location.pathname} 
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border p-2">
        <NavSection 
          title="" 
          items={bottomNavItems} 
          currentPath={location.pathname} 
        />
      </div>

      {/* User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-medium text-sm">
              {student.ephemeralHandle?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {student.ephemeralHandle || 'Anonymous'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {student.institutionCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};