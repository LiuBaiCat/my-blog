interface StarIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function StarIcon({ size = 16, color = 'var(--color-star)', className, style }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      <path d="M12 1C12 1 14.5 5.5 14.5 8.5C14.5 10.5 13 12 12 12C11 12 9.5 10.5 9.5 8.5C9.5 5.5 12 1 12 1Z" />
      <path d="M12 23C12 23 14.5 18.5 14.5 15.5C14.5 13.5 13 12 12 12C11 12 9.5 13.5 9.5 15.5C9.5 18.5 12 23 12 23Z" />
      <path d="M1 12C1 12 5.5 9.5 8.5 9.5C10.5 9.5 12 11 12 12C12 13 10.5 14.5 8.5 14.5C5.5 14.5 1 12 1 12Z" />
      <path d="M23 12C23 12 18.5 9.5 15.5 9.5C13.5 9.5 12 11 12 12C12 13 13.5 14.5 15.5 14.5C18.5 14.5 23 12 23 12Z" />
    </svg>
  );
}
