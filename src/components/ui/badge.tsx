'use client';

import { Chip } from '@mui/material';
import { forwardRef } from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'outlined' | 'filled';
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium';
  className?: string;
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, ...props }, ref) => {
    return <Chip ref={ref} label={children} {...props} />;
  }
);

Badge.displayName = 'Badge';