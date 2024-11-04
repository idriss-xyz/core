type Properties = {
  className?: string;
  size: number;
};

export const Check = ({ size, className }: Properties) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M16.6673 5L7.50065 14.1667L3.33398 10"
        stroke="#323D37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
