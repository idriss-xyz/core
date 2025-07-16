import type { SVGProps } from 'react';

export const PrimeToken = (properties: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...properties}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 288"
    >
      <defs>
        <clipPath id="circle-clip">
          <circle cx="144" cy="144" r="139" />
        </clipPath>
        <style
          dangerouslySetInnerHTML={{
            __html: `.cls-1 { fill: #def141; }`,
          }}
        />
      </defs>
      <g clipPath="url(#circle-clip)">
        <rect width="100%" height="100%" fill="black" />
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path
              className="cls-1"
              d="M268.44,71.49A144,144,0,1,0,26.93,227.86l157-156.37Z"
            />
            <path
              className="cls-1"
              d="M284,110a141.65,141.65,0,0,0-4.65-15.37H193.57L42,245.65A146.83,146.83,0,0,0,53.2,255.77L199.56,110Z"
            />
            <path
              className="cls-1"
              d="M111.8,284.39A144.19,144.19,0,0,0,285.33,171.71H224.81Z"
            />
            <path
              className="cls-1"
              d="M287.59,133.06h-78.4L72.69,269.15A141.56,141.56,0,0,0,87,276.3L215.18,148.61h72.75c.07-1.53.07-3.07.07-4.61Q288,138.48,287.59,133.06Z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
