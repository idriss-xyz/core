type Properties = {
  className?: string;
};

export const IdrissToken = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="128"
        cy="128"
        r="128"
        transform="matrix(-1 0 0 1 256 0)"
        fill="#55EB3C"
        fillOpacity={1}
      />
      <path
        d="M144.736 42V214.651H111V104.694L143.502 76.2843L111 76.3661V42H144.736Z"
        fill="#000A05"
        fillOpacity={1}
      />
    </svg>
  );
};
