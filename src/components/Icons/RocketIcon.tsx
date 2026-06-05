interface RocketIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RocketIcon({ size = 16, color = 'var(--color-rocket)', className, style }: RocketIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {/* 火箭主体 - 圆润胶囊形 */}
      <path d="M12 2C8 2 7 8 7 13C7 16 8 19 9 20L15 20C16 19 17 16 17 13C17 8 16 2 12 2Z" />
      {/* 火箭窗口 */}
      <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.85" />
      {/* 尾焰 - 简单三角形 */}
      <path d="M9 20L12 24L15 20Z" fill="var(--color-warm-orange)" opacity="0.85" />
    </svg>
  );
}
