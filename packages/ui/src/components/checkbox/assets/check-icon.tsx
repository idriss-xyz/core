type Properties = {
  className?: string;
};

export const CheckIcon = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
    >
      <path
        d="M1.5 5.7L4.35714 8.5L10.5 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
