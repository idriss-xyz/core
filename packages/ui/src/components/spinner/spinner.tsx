type Properties = {
  className?: string;
};

export const Spinner = ({ className }: Properties) => {
  return (
    <div className={className}>
      <svg
        className="size-full animate-spin"
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Spinner">
          <mask
            id="mask0_2089_788"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="34"
            height="34"
          >
            <rect
              id="Bounding Box"
              width="34"
              height="34"
              fill="currentColor"
            />
          </mask>
          <g mask="url(#mask0_2089_788)">
            <g id="Container">
              <mask
                id="mask1_2089_788"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="-1"
                y="0"
                width="35"
                height="34"
              >
                <circle
                  id="Oval Mask"
                  cx="16.9653"
                  cy="17"
                  r="17"
                  fill="currentColor"
                />
              </mask>
              <g mask="url(#mask1_2089_788)">
                <path
                  id="Shape"
                  d="M14.2289 0.173122C14.4637 0.12539 14.695 0.0730149 14.9309 0.030446C15.9097 -0.136249 16.7323 0.406159 16.9407 1.35295C17.1438 2.27393 16.6565 3.09333 15.6898 3.33282C14.0417 3.73769 12.4091 4.17971 10.9538 5.08835C6.44877 7.90166 3.89008 11.9214 3.61707 17.3392C3.59523 17.7549 3.59487 18.1716 3.58377 18.5878C3.55107 19.6561 2.88879 20.3471 1.89425 20.345C0.974326 20.3438 0.288335 19.6366 0.234325 18.5993C0.121059 16.4989 0.386665 14.4316 1.05034 12.4528C3.23007 5.95399 7.68266 1.91491 14.2289 0.173122Z"
                  fill="currentColor"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
