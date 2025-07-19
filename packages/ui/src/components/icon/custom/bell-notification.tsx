type Properties = {
  size: number;
  className?: string;
};

export const BellNotification = ({ size, className }: Properties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.24935 17.5003C9.38883 17.754 9.59389 17.9656 9.84309 18.113C10.0923 18.2604 10.3765 18.3381 10.666 18.3381C10.9555 18.3381 11.2397 18.2604 11.4889 18.113C11.7381 17.9656 11.9432 17.754 12.0827 17.5003M5.66602 6.66699C5.66602 5.34091 6.1928 4.06914 7.13048 3.13146C8.06816 2.19378 9.33993 1.66699 10.666 1.66699C11.9921 1.66699 13.2639 2.19378 14.2015 3.13146C15.1392 4.06914 15.666 5.34091 15.666 6.66699C15.666 12.5003 18.166 14.167 18.166 14.167H3.16602C3.16602 14.167 5.66602 12.5003 5.66602 6.66699Z"
        stroke="#000A05"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="15.666"
        cy="6"
        r="3"
        fill="#2CDB8A"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
};
