type Properties = {
  className?: string;
  size?: number;
};

export const Card = ({ className, size }: Properties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.35319 2.80271V2.80271C8.63144 1.80289 9.66094 1.21175 10.6647 1.47544L18.5464 3.546C19.6222 3.82862 20.2607 4.93468 19.9675 6.00763L16.1325 20.04C15.838 21.1174 14.7182 21.7449 13.6455 21.4334L5.85097 19.1702C4.79857 18.8647 4.18806 17.7691 4.48188 16.7133L4.73737 15.7953M8.35319 2.80271L3.31215 4.57075C2.29964 4.92586 1.74775 6.01668 2.06146 7.04278L4.73737 15.7953M8.35319 2.80271L4.73737 15.7953"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
