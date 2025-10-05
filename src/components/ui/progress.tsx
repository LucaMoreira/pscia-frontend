'use client';

import { LinearProgress, LinearProgressProps } from '@mui/material';
import { forwardRef } from 'react';

export interface ProgressProps extends LinearProgressProps {
  value?: number;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, ...props }, ref) => {
    return <LinearProgress ref={ref} variant="determinate" value={value} {...props} />;
  }
);

Progress.displayName = 'Progress';
