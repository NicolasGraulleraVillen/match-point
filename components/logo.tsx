interface LogoProps {
  className?: string
  showText?: boolean
}

export const Logo = ({ className = "h-8 w-8", showText = true }: LogoProps) => {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tennis ball inspired design with M and P */}
        <circle cx="50" cy="50" r="48" fill="hsl(var(--primary))" />
        <circle cx="50" cy="50" r="44" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
        
        {/* Curved lines like tennis ball seams */}
        <path
          d="M 20 30 Q 35 50 20 70"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="3"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M 80 30 Q 65 50 80 70"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="3"
          fill="none"
          opacity="0.4"
        />
        
        {/* MP letters */}
        <text
          x="50"
          y="62"
          fontSize="42"
          fontWeight="bold"
          fill="hsl(var(--primary-foreground))"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          MP
        </text>
      </svg>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">
          MatchPoint
        </span>
      )}
    </div>
  )
}

