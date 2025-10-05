'use client';

import { TextField, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return <TextField ref={ref} {...props} />;
  }
);

Input.displayName = 'Input';
