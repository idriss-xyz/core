type Properties = {
  className?: string;
  size: number;
};

export const Gem = ({ size, className }: Properties) => {
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
        d="M22 9L18 3H6L2 9M22 9L12 22M22 9H2M12 22L2 9M12 22L8 9L11 3M12 22L16 9L13 3"
        stroke="#757575"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
