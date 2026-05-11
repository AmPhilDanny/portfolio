"use client";

import dynamic from 'next/dynamic';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

/**
 * DynamicIcon Component: Renders any Lucide icon by its string name.
 * 
 * Uses Next.js dynamic imports with lucide-react/dynamicIconImports to 
 * ensure that only the requested icon is loaded in the client bundle.
 * 
 * Example usage: <DynamicIcon name="camera" className="w-6 h-6" />
 */
const DynamicIcon = ({ name, ...props }: IconProps) => {
  const Icon = dynamic(dynamicIconImports[name]);

  return <Icon {...props} />;
};

export default DynamicIcon;
