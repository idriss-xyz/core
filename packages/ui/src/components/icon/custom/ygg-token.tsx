import type { SVGProps } from 'react';

export const YggToken = (properties: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...properties}
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3880_6798)">
        <path
          d="M1.57129 4.4445L6.28557 1.77783H15.7141L20.4284 4.4445V16.8889L10.9999 22.2223L1.57129 16.8889V4.4445Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.57143 2.66667L6.28571 0H15.7143L20.4286 2.66667V4.44444L15.7143 1.77778H6.28571L1.57143 4.44444V2.66667ZM1.57143 4.44444L0 5.33333V17.7778L11 24L22 17.7778V5.33333L20.4286 4.44444V16.8889L11 22.2222L1.57143 16.8889V4.44444ZM7.85714 6.22222L6.28571 5.33333V10.6667L11 13.3333L15.7143 10.6667V5.33333L14.1429 6.22222V9.77778L11 11.5556L7.85714 9.77778V6.22222ZM14.1429 13.3333V15.1111L9.42857 17.7778V16L14.1429 13.3333Z"
          fill="url(#paint0_linear_3880_6798)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_3880_6798"
          x1="0.336112"
          y1="4.29002"
          x2="8.49223"
          y2="25.291"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDFF85" />
          <stop offset="0.479167" stopColor="#66F6FF" />
          <stop offset="1" stopColor="#CD9BFF" />
        </linearGradient>
        <clipPath id="clip0_3880_6798">
          <rect width="22" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
