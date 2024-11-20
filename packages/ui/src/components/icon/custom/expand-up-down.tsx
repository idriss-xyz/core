type Properties = {
  className?: string;
  size: number;
};
export const ExpandUpDown = ({ className, size }: Properties) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Vector"
        d="M1.00003 6.04201L4.00002 9L7 6.04201M6.99997 3.95799L3.99998 1L1 3.95799"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
