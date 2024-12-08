type Properties = {
  className?: string;
};

export const IdrissLogoCircle = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.5" cy="12" r="12" fill="#55EB3C" />
      <path
        d="M14.0817 3.90723V20.0933H10.9189V9.78478L13.966 7.12138L10.9189 7.12905V3.90723H14.0817Z"
        fill="black"
      />
    </svg>
  );
};
