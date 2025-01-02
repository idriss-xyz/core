type Properties = {
  className?: string;
};
export const More = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.52402"
        y="1.52402"
        width="15.5937"
        height="15.5937"
        rx="2.975"
        stroke="#5FEB3C"
        strokeWidth="2.05"
      />
      <rect
        x="1.52402"
        y="22.8822"
        width="15.5937"
        height="15.5937"
        rx="2.975"
        stroke="#5FEB3C"
        strokeWidth="2.05"
      />
      <rect
        x="22.8824"
        y="1.52402"
        width="15.5937"
        height="15.5937"
        rx="2.975"
        stroke="#5FEB3C"
        strokeWidth="2.05"
      />
      <path
        d="M30.6787 23.7141V37.6434"
        stroke="#5FEB3C"
        strokeWidth="2.05"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M23.7139 30.6787H37.6431"
        stroke="#5FEB3C"
        strokeWidth="2.05"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  );
};
