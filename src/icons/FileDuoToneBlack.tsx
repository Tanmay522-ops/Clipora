export const FileDuoToneBlack = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
    >
        {/* Back file (duotone effect) */}
        <path
            d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
            fill="currentColor"
            opacity="0.3"
        />
        {/* Front file */}
        <path
            d="M8 5h8l4 4v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
            fill="currentColor"
            opacity="0.6"
        />
        {/* Folded corner */}
        <path
            d="M16 5v4h4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="currentColor"
            opacity="0.9"
        />
        {/* Lines inside file */}
        <path
            d="M10 13h6M10 17h4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
)