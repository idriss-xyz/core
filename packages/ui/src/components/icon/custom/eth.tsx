type Properties = {
  className?: string;
  size: number;
};

export const Eth = ({ size, className }: Properties) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
    >
      <path fill="#3C3C3B" d="M256 362v107l131-185z" />
      <path fill="#343434" d="m256 41 131 218-131 78-132-78" />
      <path fill="#8C8C8C" d="M256 41v158l-132 60m0 25 132 78v107" />
      <path fill="#141414" d="M256 199v138l131-78" />
      <path fill="#393939" d="m124 259 132-60v138" />
    </svg>
  );
};
