type Properties = {
  size: number;
  className?: string;
};

export const Blockscout = ({ size, className }: Properties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.586 2.963a.74.74 0 0 0-.741-.74H6.089a.74.74 0 0 0-.74.74V4.72a.74.74 0 0 1-.741.74H2.963a.74.74 0 0 0-.74.741v10.82c0 .408.331.74.74.74H4.72a.74.74 0 0 0 .74-.74V6.2c0-.409.332-.74.741-.74h1.645a.74.74 0 0 0 .74-.741V2.963Zm6.473 0a.74.74 0 0 0-.74-.74h-1.756a.74.74 0 0 0-.74.74V4.72c0 .409.331.74.74.74h1.645c.409 0 .74.332.74.741v10.82c0 .408.332.74.741.74h1.756a.74.74 0 0 0 .74-.74V6.2a.74.74 0 0 0-.74-.74H15.8a.74.74 0 0 1-.74-.741V2.963ZM11.822 9.16a.74.74 0 0 0-.74-.741H9.326a.74.74 0 0 0-.74.74v4.808c0 .41.331.74.74.74h1.756a.74.74 0 0 0 .74-.74V9.16Z"
        fill="currentColor"
      />
    </svg>
  );
};
