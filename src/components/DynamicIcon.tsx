"use client";

import React from 'react';
import * as HugeIcons from 'hugeicons-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

/**
 * DynamicIcon Component: Renders any HugeIcon by its string name.
 *
 * Looks up the icon by name in the hugeicons-react package, with an
 * automatic "Icon" suffix appended if not already present.
 * Gracefully falls back to a default Globe icon if the name is not found.
 *
 * Example usage: <DynamicIcon name="camera" className="w-6 h-6" />
 */
const DynamicIcon = ({ name, ...props }: IconProps) => {
  // Convert kebab-case to PascalCase + Icon suffix
  const toPascal = (str: string) =>
    str
      .replace(/-/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');

  const candidates = [
    name,                          // exact match
    `${name}Icon`,                 // with Icon suffix
    toPascal(name),                // PascalCase
    `${toPascal(name)}Icon`,       // PascalCase + Icon
  ];

  const icons = HugeIcons as Record<string, any>;
  const Icon = candidates.map((c) => icons[c]).find(Boolean) ?? icons['GlobeIcon'];

  if (!Icon) return null;
  return <Icon {...props} />;
};

export default DynamicIcon;

