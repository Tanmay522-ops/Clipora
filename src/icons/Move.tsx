const Move = ({ size = 24, fill = '#a4a4a4', className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}  // ← add this
    >
      <rect
        x="3"
        y="8"
        width="18"
        height="8"
        rx="4"
        fill={fill}
        fillOpacity="0.3"
      />
      <rect
        x="7"
        y="10.5"
        width="4"
        height="3"
        rx="1.5"
        fill={fill}
      />
    </svg>
  )
}

export default Move