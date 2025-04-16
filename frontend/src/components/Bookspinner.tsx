interface BookSpinnerProps {
  className?: string;
}

export function BookSpinner({ className = '' }: BookSpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className={`${className}`}
    >
      <rect x="20" y="90" width="80" height="6" fill="#4F46E5" rx="2" />

      <g>
        <rect x="25" y="45" width="12" height="45" fill="#4F46E5" rx="1">
          <animate
            attributeName="height"
            values="45;43;45"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>

        <rect x="42" y="55" width="15" height="35" fill="#818CF8" rx="1">
          <animate
            attributeName="height"
            values="35;33;35"
            dur="2s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </rect>

        <rect x="62" y="60" width="10" height="30" fill="#4F46E5" rx="1">
          <animate
            attributeName="height"
            values="30;28;30"
            dur="2s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </rect>

        <rect x="77" y="40" width="13" height="50" fill="#818CF8" rx="1">
          <animate
            attributeName="height"
            values="50;48;50"
            dur="2s"
            repeatCount="indefinite"
            begin="0.9s"
          />
        </rect>
      </g>

      <g stroke="#4F46E5" strokeWidth="0.5">
        <line x1="29" y1="50" x2="29" y2="85" />
        <line x1="49" y1="60" x2="49" y2="85" />
        <line x1="66" y1="65" x2="66" y2="85" />
        <line x1="83" y1="45" x2="83" y2="85" />
      </g>

      <rect
        x="15"
        y="35"
        width="90"
        height="60"
        fill="#EEF2FF"
        opacity="0.1"
        rx="4"
      >
        <animate
          attributeName="opacity"
          values="0.1;0.15;0.1"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}
