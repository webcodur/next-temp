export type LoadingSize = 'small' | 'medium' | 'large';
export type LoadingColor = 'blue' | 'green' | 'red' | 'purple' | 'primary';

export interface BaseLoadingProps {
  size?: LoadingSize;
  color?: LoadingColor;
  className?: string;
} 