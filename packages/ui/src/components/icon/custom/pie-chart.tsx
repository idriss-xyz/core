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
      fill="none"
    >
      <g clipPath="url(#clip0_2054_2291)">
        <path
          d="M17.6752 13.242C17.145 14.4957 16.3158 15.6005 15.2601 16.4597C14.2043 17.319 12.9541 17.9065 11.6189 18.171C10.2836 18.4354 8.90386 18.3688 7.6003 17.9768C6.29673 17.5849 5.10903 16.8796 4.14102 15.9225C3.17302 14.9655 2.45419 13.786 2.04737 12.4869C1.64055 11.1879 1.55814 9.80906 1.80734 8.47085C2.05653 7.13264 2.62975 5.87585 3.47688 4.81035C4.324 3.74485 5.41924 2.90309 6.66684 2.35866M18.3335 10.0003C18.3335 8.90598 18.118 7.82234 17.6992 6.8113C17.2804 5.80025 16.6666 4.88159 15.8927 4.10777C15.1189 3.33395 14.2002 2.72012 13.1892 2.30133C12.1782 1.88254 11.0945 1.66699 10.0002 1.66699V10.0003H18.3335Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2054_2291">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
