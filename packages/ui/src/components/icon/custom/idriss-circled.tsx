type Properties = {
  className?: string;
  size: number;
};

export const IdrissCircled = ({ size, className }: Properties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.5" cy="12" r="12" fill="black" />
      <path
        d="M13.9877 4.00001V7.02805L13.9648 7.02811L11.011 7.03555V4.00001H13.9877ZM11.011 9.82677L13.9877 7.22485V20H11.011V9.82677Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="0.186046"
      />
    </svg>
  );
};
