export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    className = '',
    id,
    ...props
}) {
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const variantClass = `btn-${variant}`;

    return (
        <button
            className={`btn ${variantClass} ${sizeClass} ${className}`}
            disabled={disabled || loading}
            id={id}
            {...props}
        >
            {loading ? (
                <>
                    <div className="spinner" style={{ width: 16, height: 16 }} />
                    {children}
                </>
            ) : (
                <>
                    {Icon && <Icon style={{ fontSize: '1.1em' }} />}
                    {children}
                    {IconRight && <IconRight style={{ fontSize: '1.1em' }} />}
                </>
            )}
        </button>
    );
}
