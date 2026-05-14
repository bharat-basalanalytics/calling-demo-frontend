export default function Button ({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  onClick = undefined,
  disabled = false
}) {
  return (
    <button
      className={`btn btn__${variant} ${className}`}
      type={type}
      disabled={disabled}
      {...(onClick ? { onClick } : {})}
    >
      {children}
    </button>
  )
}
