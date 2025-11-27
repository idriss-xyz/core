/* eslint-disable tailwindcss/no-custom-classname */
import type { SVGProps } from 'react';

export const GradientCircle = (properties: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...properties}
      width="98"
      height="98"
      viewBox="0 0 98 98"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M49 0.5C75.7858 0.5 97.5 22.2142 97.5 49C97.5 75.7858 75.7858 97.5 49 97.5C22.2142 97.5 0.5 75.7858 0.5 49C0.5 22.2142 22.2142 0.5 49 0.5Z"
        fill="white"
      />
      <path
        d="M49 0.5C75.7858 0.5 97.5 22.2142 97.5 49C97.5 75.7858 75.7858 97.5 49 97.5C22.2142 97.5 0.5 75.7858 0.5 49C0.5 22.2142 22.2142 0.5 49 0.5Z"
        stroke="#2AD012"
      />
      <g clipPath="url(#clip0_10083_33660)">
        <g opacity="0.3" filter="url(#filter0_f_10083_33660)">
          <ellipse cx="48.666" cy="77.5" rx="48" ry="19.5" fill="#5FEB3C" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_10083_33660"
          x="-19.334"
          y="38"
          width="136"
          height="79"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="10"
            result="effect1_foregroundBlur_10083_33660"
          />
        </filter>
        <clipPath id="clip0_10083_33660">
          <path
            d="M2.66602 44.6364C2.66602 20.5367 22.2027 1 46.3024 1H53.0297C77.1293 1 96.666 20.5367 96.666 44.6364V50C96.666 75.9574 75.6234 97 49.666 97C23.7086 97 2.66602 75.9574 2.66602 50V44.6364Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
