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

type CircleProperties = {
  className?: string;
  size: number;
};

export const EthCircled = ({ size, className }: CircleProperties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 60c16.569 0 30-13.431 30-30C60 13.431 46.569 0 30 0 13.431 0 0 13.431 0 30c0 16.569 13.431 30 30 30Z"
        fill="#fff"
        fillOpacity=".1"
      />
      <path d="M30.935 7.5v16.631l14.057 6.282L30.935 7.5Z" fill="#BDBDBD" />
      <path d="M30.934 7.5 16.875 30.413l14.059-6.282V7.5Z" fill="#fff" />
      <path d="M30.935 41.191v11.3l14.066-19.46-14.066 8.16Z" fill="#BDBDBD" />
      <path d="M30.934 52.492V41.189l-14.059-8.158 14.059 19.46Z" fill="#fff" />
      <path
        d="m30.935 38.576 14.057-8.162-14.057-6.277v14.44Z"
        fill="#B0B0B0"
      />
      <path
        d="m16.875 30.414 14.059 8.162v-14.44l-14.059 6.278Z"
        fill="#D5D5D5"
      />
    </svg>
  );
};
