'use client';

import { TextField } from '@mui/material';
import { forwardRef } from 'react';

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  placeholder?: string;
}

export const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
  ({ rows = 4, ...props }, ref) => {
    return <TextField ref={ref} multiline rows={rows} {...props} />;
  }
);

Textarea.displayName = 'Textarea';