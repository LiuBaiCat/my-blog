interface CloverIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CloverIcon({ size = 16, color = 'var(--color-clover)', className, style }: CloverIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {/* 四片水滴形叶子，清晰不重叠 */}
      <path d="M12 2 C8 2 8 9 12 12 C16 9 16 2 12 2Z" />
      <path d="M22 12 C22 8 15 8 12 12 C15 16 22 16 22 12Z" />
      <path d="M12 22 C16 22 16 15 12 12 C8 15 8 22 12 22Z" />
      <path d="M2 12 C2 16 9 16 12 12 C9 8 2 8 2 12Z" />
      {/* 中心小圆点连接 */}
      <circle cx="12" cy="12" r="1.5" opacity="0.6" />
    </svg>
  );
}
