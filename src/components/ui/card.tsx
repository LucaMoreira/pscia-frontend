'use client';

import { 
  Card as MuiCard, 
  CardContent as MuiCardContent, 
  CardHeader as MuiCardHeader,
  CardProps as MuiCardProps,
  CardContentProps as MuiCardContentProps,
  CardHeaderProps as MuiCardHeaderProps
} from '@mui/material';
import { forwardRef } from 'react';

export const Card = forwardRef<HTMLDivElement, MuiCardProps>(
  (props, ref) => {
    return <MuiCard ref={ref} {...props} />;
  }
);

Card.displayName = 'Card';

export const CardContent = forwardRef<HTMLDivElement, MuiCardContentProps>(
  (props, ref) => {
    return <MuiCardContent ref={ref} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

export const CardHeader = forwardRef<HTMLDivElement, MuiCardHeaderProps>(
  (props, ref) => {
    return <MuiCardHeader ref={ref} {...props} />;
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);

CardDescription.displayName = 'CardDescription';
