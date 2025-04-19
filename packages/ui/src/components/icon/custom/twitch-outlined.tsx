type Properties = {
  size?: number;
  className?: string;
};

export const TwitchOutlined = ({ className, size = 64 }: Properties) => {
  return (
    <svg
      fill="none"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group">
        <g id="Group_2">
          <path
            id="a"
            d="M42.6673 18.6667V26.6667"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="a_2"
            d="M42.6673 18.6667V26.6667"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Path"
            d="M32.0013 18.6667V26.6667"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Path_2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M52.5533 35.448L43.4493 44.552C42.948 45.0533 42.2706 45.3333 41.564 45.3333H32.0013L21.3346 56V45.3333H13.3346C11.8626 45.3333 10.668 44.1387 10.668 42.6667V19.7707C10.668 19.064 10.948 18.384 11.4493 17.8853L20.5533 8.78133C21.0546 8.28 21.732 8 22.4386 8H50.668C52.14 8 53.3346 9.19467 53.3346 10.6667V33.5627C53.3346 34.2693 53.0546 34.9467 52.5533 35.448Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
};

export const TwitchOutlinedBold = ({ className, size = 64 }: Properties) => {
  return (
    <svg
      fill="none"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.333 9.334v4M21.333 9.334v4M16 9.334v4"
        stroke="#E7FED8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        clipRule="evenodd"
        d="m26.276 17.724-4.552 4.552c-.25.25-.59.39-.943.39H16L10.667 28v-5.333h-4a1.334 1.334 0 0 1-1.334-1.334V9.885c0-.353.14-.693.39-.942l4.553-4.552c.25-.251.59-.391.943-.391h14.114c.736 0 1.334.597 1.334 1.333v11.448c0 .354-.14.692-.391.943Z"
        stroke="#E7FED8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
