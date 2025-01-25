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
      <circle cx="12" cy="12" r="12" fill="#55EB3C" />
      <path
        d="M13.5812 3.90674V20.0928H10.4185V9.78429L13.4655 7.12089L10.4185 7.12856V3.90674H13.5812Z"
        fill="black"
      />
    </svg>
  );
};
