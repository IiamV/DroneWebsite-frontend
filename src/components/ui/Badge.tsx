interface BadgeProps {
  color: string
  label: string
  className?: string
}

export function Badge({ color, label, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
      style={{ backgroundColor: color, color: '#fff' }}
    >
      {label}
    </span>
  )
}
