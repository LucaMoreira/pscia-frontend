'use client';

import { Drawer, DrawerProps as MuiDrawerProps } from '@mui/material';
import { forwardRef } from 'react';

export interface SheetProps extends MuiDrawerProps {
  variant?: 'temporary' | 'persistent' | 'permanent';
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  ({ children, ...props }, ref) => {
    return <Drawer ref={ref} {...props}>{children}</Drawer>;
  }
);

Sheet.displayName = 'Sheet';

export const SheetContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

SheetContent.displayName = 'SheetContent';

export const SheetTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>;
  }
);

SheetTrigger.displayName = 'SheetTrigger';
