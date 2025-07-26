import type { SVGProps } from 'react';

export const PdtToken = (properties: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...properties}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3880_6802)">
        <circle cx="12" cy="12" r="12" fill="black" />
        <path
          d="M11.8004 19.2992L8.65408 13.6873L6.26783 17.9059L3 10.8222L6.52325 6.74002L8.66027 10.5524L11.8004 5L14.9405 10.5524L17.0775 6.74002L20.6 10.8222L17.3314 17.9067L14.9452 13.6881L11.7988 19.3L11.8004 19.2992ZM9.54031 12.1214L11.8012 16.1538L14.062 12.1214L11.8012 8.12435L9.54031 12.1214ZM4.81038 11.0671L6.40948 14.5328L7.77481 12.1184L6.25003 9.39866L4.81038 11.0671ZM15.8268 12.1184L17.1921 14.5328L18.7911 11.0671L17.3515 9.39866L15.8268 12.1184Z"
          fill="#11F10C"
        />
      </g>
      <defs>
        <clipPath id="clip0_3880_6802">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
