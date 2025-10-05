'use client';

import { 
  Menu, 
  MenuItem, 
  MenuProps as MuiMenuProps,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { forwardRef, useState } from 'react';

export interface DropdownMenuProps extends MuiMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, ...props }, ref) => {
    return <Menu ref={ref} {...props}>{children}</Menu>;
  }
);

DropdownMenu.displayName = 'DropdownMenu';

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => {
    return <button ref={ref} {...props}>{children}</button>;
  }
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement> & { 
  icon?: React.ReactNode;
  children: React.ReactNode;
}>(
  ({ children, icon, ...props }, ref) => {
    return (
      <MenuItem ref={ref} {...props}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={children} />
      </MenuItem>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuLabel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';

export const DropdownMenuSeparator = forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ ...props }, ref) => {
    return <Divider ref={ref} {...props} />;
  }
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';