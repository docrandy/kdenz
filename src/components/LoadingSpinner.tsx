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

  // Use inline styles for hex colors, Tailwind classes otherwise
  const isHexColor = color.startsWith('#');
  const borderStyle = isHexColor
    ? { borderColor: color, borderTopColor: 'transparent' }
    : {};

  return (
    <div
      className={`${sizeClasses[size]} rounded-full animate-spin ${
        !isHexColor ? `border-${color} border-t-transparent` : ''
      } ${className}`}
      style={isHexColor ? borderStyle : undefined}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
