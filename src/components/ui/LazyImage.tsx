import React from 'react'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export default function LazyImage({ src, alt, className = '', priority = false, ...rest }: LazyImageProps) {
  // A very small translucent SVG as placeholder to avoid layout shift
  const placeholder = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='9' viewBox='0 0 16 9'><rect width='16' height='9' fill='%23f8fafc'/></svg>`

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
      {...rest}
      style={{ backgroundImage: `url('${placeholder}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    />
  )
}
