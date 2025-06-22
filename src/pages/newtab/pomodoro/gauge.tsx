interface GaugeProps {
  percent?: number
  width: number
  strokeWidth?: number
  className?: string
}

const Gauge = ({ className, percent = 0, width, strokeWidth }: GaugeProps) => {
  const radius = width / 2
  const stroke = strokeWidth ?? width * 0.1
  const innerRadius = radius - stroke / 2
  const circumference = innerRadius * 2 * Math.PI
  const arc = circumference * 0.75
  const dashArray = `${arc} ${circumference}`
  const transform = `rotate(135, ${radius}, ${radius})`

  const clampedPercent = Math.max(0, Math.min(100, percent))
  const offset = arc - (clampedPercent / 100) * arc

  return (
    <svg className={className} width={width} height={width}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="15%" stopColor="var(--accent-foreground)" />
          <stop offset="85%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <circle
        className="stroke-accent/40 backdrop-blur-xl"
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        strokeDasharray={dashArray}
        strokeLinecap="round"
        strokeWidth={stroke}
        transform={transform}
      />
      <circle
        className="transition-all duration-300"
        cx={radius}
        cy={radius}
        fill="transparent"
        r={innerRadius}
        stroke="url(#grad)"
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth={stroke}
        transform={transform}
      />
    </svg>
  )
}

export default Gauge
