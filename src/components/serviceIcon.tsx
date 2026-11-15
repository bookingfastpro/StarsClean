import React from 'react';
import { Car, Ship, Wine, Coffee, Heart, Plane, Waves, Mountain, Sun, Compass, Sparkles } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Car, Ship, Wine, Coffee, Heart, Plane, Waves, Mountain, Sun, Compass,
};

export const getServiceIcon = (iconName: string, size = 32, className = '') => {
  const Icon = ICONS[iconName] || Sparkles;
  return <Icon size={size} className={className} />;
};
