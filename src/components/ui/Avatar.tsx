import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: number
  className?: string
}

export function Avatar({ src, alt, size = 40, className = '' }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    )
  }

  const initials = alt
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg-primary)] font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={alt}
    >
      {initials}
    </span>
  )
}
