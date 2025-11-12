import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn, stringUtils } from '@/utils';
import { useStore } from '@/stores/useStore';
import { ROUTES, APP_CONFIG } from '@/constants';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Menu,
  MessageCircle,
  Calendar,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const { student, clearUserData } = useStore();
  
  const handleLogout = () => {
    clearUserData();
    navigate(ROUTES.home);
  };

  const userInitials = student?.ephemeralHandle 
    ? stringUtils.extractInitials(student.ephemeralHandle)
    : 'U';

  return (
    <header className={cn(
      "bg-card/80 backdrop-blur-md border-b border-border/50",
      "px-4 lg:px-6 h-16 flex items-center justify-between",
      "shadow-soft",
      className
    )}>
      {/* Logo and Brand */}
      <div className="flex items-center space-x-4">
        <Link 
          to={student ? ROUTES.dashboard : ROUTES.home}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/sahara-logo.svg" 
            alt="Sahara Logo" 
            className="w-8 h-8"
          />
          <span className="font-semibold text-foreground hidden sm:block text-lg">
            Sahara
          </span>
        </Link>
      </div>

      {/* Navigation Links - Desktop */}
      {student && (
        <nav className="hidden md:flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(ROUTES.chat)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(ROUTES.resources)}
            className="text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Resources
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(ROUTES.booking)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Booking
          </Button>
        </nav>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {student ? (
          <>
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {student.ephemeralHandle || 'Anonymous User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {student.role || 'Student'} • {student.institutionCode}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(ROUTES.dashboard)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(ROUTES.tracker)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Mood Tracker</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          /* Guest Actions */
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/counselor/login')}
            >
              For Counsellors
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              onClick={() => navigate(ROUTES.onboarding)}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};