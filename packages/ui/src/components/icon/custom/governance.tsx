type Properties = {
  className?: string;
};

export const Governance = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24.0007 32L29.334 37.3334L40.0007 26.6667M58.6673 50.6667H5.33398M13.334 18.6667C13.334 15.7334 15.734 13.3334 18.6673 13.3334H45.334C46.7485 13.3334 48.105 13.8953 49.1052 14.8955C50.1054 15.8957 50.6673 17.2522 50.6673 18.6667V50.6667H13.334V18.6667Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
