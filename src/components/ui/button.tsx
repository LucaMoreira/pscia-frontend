'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export interface ButtonProps extends MuiButtonProps {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    return <MuiButton ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';