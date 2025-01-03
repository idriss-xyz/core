type Properties = {
  className?: string;
};

export const Jumper = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Left Icon">
        <path
          id="Vector"
          d="M11.0612 10.7698L11.4148 10.4163L11.0612 10.0627L9.86801 8.86947L12.2545 6.483L14.9944 9.22304L14.9944 9.22309C15.2661 9.49474 15.428 9.93542 15.428 10.4162C15.428 10.897 15.2661 11.3378 14.9944 11.6095L8.80727 17.7966C8.53556 18.0683 8.09486 18.2302 7.61406 18.2302C7.13327 18.2302 6.69256 18.0683 6.42084 17.7966L5.22762 16.6034L11.0612 10.7698Z"
          fill="black"
          stroke="#000A05"
        />
        <path
          id="Vector_2"
          opacity="0.5"
          d="M4.52051 4.22936L6.06729 2.68258C6.84068 1.90919 8.38746 1.90919 9.16085 2.68258L10.7076 4.22936L7.61407 7.32292L4.52051 4.22936Z"
          fill="black"
        />
      </g>
    </svg>
  );
};
