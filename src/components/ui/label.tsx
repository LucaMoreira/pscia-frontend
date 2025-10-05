'use client';

import { FormLabel, FormLabelProps } from '@mui/material';
import { forwardRef } from 'react';

export const Label = forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => {
    return <FormLabel ref={ref} {...props} />;
  }
);

Label.displayName = 'Label';
