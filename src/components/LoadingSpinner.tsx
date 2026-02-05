/**
 * Loading Spinner Component
 * Reusable loading indicator with clinical styling
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  color = 'clinical-accent',
  className = '',
}: LoadingSpinnerProps) {
  // Size mapping
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  // Use Tailwind color if provided, otherwise default
  const borderColor = color.startsWith('#') ? color : `var(--${color})`;
  const borderStyle = color.startsWith('#')
    ? { borderColor: color, borderTopColor: 'transparent' }
    : {};

  return (
    <div
      className={`${sizeClasses[size]} rounded-full animate-spin ${
        !color.startsWith('#') ? `border-${color} border-t-transparent` : ''
      } ${className}`}
      style={color.startsWith('#') ? borderStyle : undefined}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
