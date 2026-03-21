const Button = ({ label, href, icon: Icon, variant = 'primary', onClick, type = 'button' }) => {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer'
  const variants = {
    primary: 'bg-primary text-[#0E0E0E] hover:bg-primary-light',
    outline:
      'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white hover:text-neutral-900 dark:hover:text-white',
    'outline-dark':
      'border border-[#0E0E0E] text-[#0E0E0E] hover:bg-[#0E0E0E] hover:text-white',
  }

  const classes = `${base} ${variants[variant] ?? variants.primary}`

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer"
      >
        {Icon && <Icon size={18} />}
        {label}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {Icon && <Icon size={18} />}
      {label}
    </button>
  )
}

export default Button
