import React from 'react';
import { AccessibleButton, AccessibleInput } from './ui/accessible';
import { useColorBlindness, useTextScaling, useReducedMotion, useHighContrast } from '../hooks/useAccessibility';
import { useUIStore } from '../stores';
import { cn } from '../lib/utils';

interface AccessibilitySettingsProps {
  className?: string;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ className }) => {
  const { theme, setTheme, preferences, setPreferences } = useUIStore();
  const { setColorBlindnessFilter, currentFilter } = useColorBlindness();
  const { setTextScale, currentScale, textScales } = useTextScaling();
  const prefersReducedMotion = useReducedMotion();
  const highContrast = useHighContrast();

  const colorBlindnessOptions = [
    { value: 'none', label: 'No Filter', description: 'Normal color vision' },
    { value: 'protanopia', label: 'Protanopia', description: 'Red color blindness' },
    { value: 'deuteranopia', label: 'Deuteranopia', description: 'Green color blindness' },
    { value: 'tritanopia', label: 'Tritanopia', description: 'Blue color blindness' },
    { value: 'achromatopsia', label: 'Achromatopsia', description: 'Complete color blindness' }
  ];

  const textScaleOptions = [
    { value: 'small', label: 'Small', description: '87.5% of normal size' },
    { value: 'normal', label: 'Normal', description: 'Default text size' },
    { value: 'large', label: 'Large', description: '112.5% of normal size' },
    { value: 'extra-large', label: 'Extra Large', description: '125% of normal size' },
    { value: 'huge', label: 'Huge', description: '150% of normal size' }
  ];

  return (
    <div className={cn('space-y-8 p-6', className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Accessibility Settings</h2>
        <p className="text-muted-foreground">
          Customize your experience to meet your accessibility needs.
        </p>
      </div>

      {/* Vision Settings */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Vision & Display</h3>
        
        {/* Theme Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Theme Preferences</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['light', 'dark', 'auto'] as const).map((mode) => (
              <AccessibleButton
                key={mode}
                variant={theme.mode === mode ? 'primary' : 'secondary'}
                onClick={() => setTheme({ mode })}
                className="justify-start"
              >
                {mode === 'light' && '☀️'}
                {mode === 'dark' && '🌙'}
                {mode === 'auto' && '🔄'}
                <span className="ml-2 capitalize">{mode}</span>
              </AccessibleButton>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">High Contrast</h4>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <AccessibleButton
              variant={theme.highContrast ? 'primary' : 'secondary'}
              onClick={() => setTheme({ highContrast: !theme.highContrast })}
              aria-pressed={theme.highContrast}
            >
              {theme.highContrast ? 'On' : 'Off'}
            </AccessibleButton>
          </div>
          {highContrast && (
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              ℹ️ Your system has high contrast mode enabled
            </p>
          )}
        </div>

        {/* Text Scaling */}
        <div className="space-y-4">
          <h4 className="font-medium">Text Size</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {textScaleOptions.map((option) => (
              <AccessibleButton
                key={option.value}
                variant={currentScale === option.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTextScale(option.value as keyof typeof textScales)}
                describedBy={`text-scale-${option.value}-desc`}
              >
                {option.label}
              </AccessibleButton>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            {textScaleOptions.find(opt => opt.value === currentScale)?.description}
          </div>
        </div>

        {/* Color Blindness Support */}
        <div className="space-y-4">
          <h4 className="font-medium">Color Vision Support</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {colorBlindnessOptions.map((option) => (
              <AccessibleButton
                key={option.value}
                variant={currentFilter === option.value ? 'primary' : 'secondary'}
                onClick={() => setColorBlindnessFilter(option.value as any)}
                className="justify-start text-left h-auto p-3"
                describedBy={`color-filter-${option.value}-desc`}
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs opacity-75">{option.description}</div>
                </div>
              </AccessibleButton>
            ))}
          </div>
        </div>
      </section>

      {/* Motion Settings */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Motion & Animation</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Reduce Motion</h4>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <AccessibleButton
              variant={theme.reducedMotion ? 'primary' : 'secondary'}
              onClick={() => setTheme({ reducedMotion: !theme.reducedMotion })}
              aria-pressed={theme.reducedMotion}
            >
              {theme.reducedMotion ? 'On' : 'Off'}
            </AccessibleButton>
          </div>
          {prefersReducedMotion && (
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              ℹ️ Your system has reduced motion enabled
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Animations</h4>
              <p className="text-sm text-muted-foreground">
                Show decorative animations and transitions
              </p>
            </div>
            <AccessibleButton
              variant={preferences.animationsEnabled ? 'primary' : 'secondary'}
              onClick={() => setPreferences({ animationsEnabled: !preferences.animationsEnabled })}
              aria-pressed={preferences.animationsEnabled}
              disabled={theme.reducedMotion}
            >
              {preferences.animationsEnabled ? 'On' : 'Off'}
            </AccessibleButton>
          </div>
        </div>
      </section>

      {/* Audio Settings */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Audio & Notifications</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sound Effects</h4>
              <p className="text-sm text-muted-foreground">
                Play sounds for interactions and notifications
              </p>
            </div>
            <AccessibleButton
              variant={preferences.enableSounds ? 'primary' : 'secondary'}
              onClick={() => setPreferences({ enableSounds: !preferences.enableSounds })}
              aria-pressed={preferences.enableSounds}
            >
              {preferences.enableSounds ? 'On' : 'Off'}
            </AccessibleButton>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Show system and app notifications
              </p>
            </div>
            <AccessibleButton
              variant={preferences.enableNotifications ? 'primary' : 'secondary'}
              onClick={() => setPreferences({ enableNotifications: !preferences.enableNotifications })}
              aria-pressed={preferences.enableNotifications}
            >
              {preferences.enableNotifications ? 'On' : 'Off'}
            </AccessibleButton>
          </div>
        </div>
      </section>

      {/* Keyboard Navigation Help */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Keyboard Navigation</h3>
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-medium">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><kbd className="px-2 py-1 bg-background rounded">Tab</kbd> Navigate forward</div>
            <div><kbd className="px-2 py-1 bg-background rounded">Shift + Tab</kbd> Navigate backward</div>
            <div><kbd className="px-2 py-1 bg-background rounded">Enter</kbd> Activate button/link</div>
            <div><kbd className="px-2 py-1 bg-background rounded">Space</kbd> Toggle checkbox/button</div>
            <div><kbd className="px-2 py-1 bg-background rounded">Escape</kbd> Close modal/menu</div>
            <div><kbd className="px-2 py-1 bg-background rounded">Arrow Keys</kbd> Navigate lists/menus</div>
          </div>
        </div>
      </section>

      {/* Reset Settings */}
      <section className="pt-6 border-t">
        <AccessibleButton
          variant="secondary"
          onClick={() => {
            setTheme({
              mode: 'auto',
              reducedMotion: false,
              highContrast: false,
              fontSize: 'md',
              colorScheme: 'default'
            });
            setPreferences({
              animationsEnabled: true,
              enableSounds: true,
              enableNotifications: true,
              colorBlindnessFilter: 'none',
              textScale: 'normal'
            });
            setColorBlindnessFilter('none');
            setTextScale('normal');
          }}
        >
          Reset to Defaults
        </AccessibleButton>
      </section>
    </div>
  );
};