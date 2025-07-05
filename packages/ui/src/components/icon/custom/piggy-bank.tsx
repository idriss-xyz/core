type Properties = {
  className?: string;
  size: number;
};

export const PiggyBank = ({ size, className }: Properties) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12C5 6.7 12.5 5.5 16 7C16.2 6.4 17.5 5 19 5V8C19.5 8.5 20 9 20 10H22V14H20C19.7 15 19 15.5 18 16V20H14V18H11V20H7V16.5C5 15 5 13.8 5 12ZM5 12H4C2.9 12 2 11.1 2 10V9"
        stroke="#757575"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
