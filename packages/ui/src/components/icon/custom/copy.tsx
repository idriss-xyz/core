type Properties = {
  className?: string;
};

export const Copy = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 16C3.4 16 2.5 15.1 2.5 14V4C2.5 2.9 3.4 2 4.5 2H14.5C15.6 2 16.5 2.9 16.5 4M10.5 8H20.5C21.6046 8 22.5 8.89543 22.5 10V20C22.5 21.1046 21.6046 22 20.5 22H10.5C9.39543 22 8.5 21.1046 8.5 20V10C8.5 8.89543 9.39543 8 10.5 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
