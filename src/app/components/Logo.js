export default function Logo({ className = "", color = "currentColor" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1600 250"
            className={className}
            fill={color}
            aria-label="Cuts & Grooves"
        >
            <text
                x="0"
                y="55%"
                dominantBaseline="middle"
                textAnchor="start"
                fontFamily="var(--font-heading)"
                fontWeight="500"
                fontSize="180"
                letterSpacing="0.02em"
                fill="currentColor"
            >
                Cuts &amp; Grooves
            </text>
        </svg>
    );
}
