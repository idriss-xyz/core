type Properties = {
  className?: string;
  size: number;
};

export const Minus = ({ size, className }: Properties) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Icons/General/minus">
        <path
          id="Vector"
          d="M5 12H19"
          stroke="#4E505A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};
