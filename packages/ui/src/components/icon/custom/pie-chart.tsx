type Properties = {
  className?: string;
  size: number;
};

export const PieChart = ({ size, className }: Properties) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4275_12872)">
        <path
          d="M17.675 13.2415C17.1449 14.4952 16.3157 15.6 15.2599 16.4593C14.2041 17.3185 12.954 17.906 11.6187 18.1705C10.2834 18.4349 8.90369 18.3683 7.60012 17.9763C6.29656 17.5844 5.10885 16.8791 4.14085 15.922C3.17284 14.965 2.45401 13.7855 2.0472 12.4865C1.64038 11.1875 1.55797 9.80858 1.80716 8.47037C2.05636 7.13215 2.62958 5.87536 3.4767 4.80986C4.32383 3.74436 5.41907 2.9026 6.66667 2.35817M18.3333 9.99984C18.3333 8.90549 18.1178 7.82185 17.699 6.81081C17.2802 5.79976 16.6664 4.8811 15.8926 4.10728C15.1187 3.33346 14.2001 2.71963 13.189 2.30084C12.178 1.88205 11.0943 1.6665 10 1.6665V9.99984H18.3333Z"
          stroke="#757575"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4275_12872">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
