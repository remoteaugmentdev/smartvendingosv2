interface LogoProps {
  size?: number
  className?: string
  hideText?: boolean
}

export function Logo({ size = 48, className, hideText = false }: LogoProps) {
  const src = '/logo.png'
  const fontSize = size * 0.45
  
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="SmartVendingOS Logo"
        style={{ display: 'block', maxHeight: '40px', width: 'auto', height: 'auto' }}
      />
      {!hideText && (
        <span 
          className="font-bold tracking-tight whitespace-nowrap"
          style={{ 
            fontSize,
            lineHeight: 1,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <span style={{ color: '#0f172a' }}>SmartVending</span>
          <span style={{ color: '#2563eb' }}>OS</span>
        </span>
      )}
    </div>
  )
}
