'use client';

import { Alert as MuiAlert, AlertProps as MuiAlertProps, AlertTitle } from '@mui/material';
import { forwardRef } from 'react';

export interface AlertProps extends MuiAlertProps {
  title?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ title, children, ...props }, ref) => {
    return (
      <MuiAlert ref={ref} {...props}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </MuiAlert>
    );
  }
);

Alert.displayName = 'Alert';

export const AlertDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

AlertDescription.displayName = 'AlertDescription';