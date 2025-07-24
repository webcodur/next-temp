import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'neu-flat border-transparent bg-primary text-primary-foreground',
        primary: 'neu-flat border-transparent bg-primary text-primary-foreground',
        secondary: 'neu-flat border-transparent bg-secondary text-secondary-foreground',
        destructive: 'neu-flat border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground border-border',
        'outline-primary': 'text-primary border-primary/50 bg-background hover:bg-primary/10',
        'outline-secondary': 'text-secondary border-secondary/50 bg-background hover:bg-secondary/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }; 