type Properties = {
  size: number;
  className?: string;
};

export const Etherscan = ({ size, className }: Properties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)" fill="currentColor">
        <path d="M4.193 9.499a.839.839 0 0 1 .843-.839l1.396.005a.84.84 0 0 1 .84.84v5.28c.157-.046.36-.095.58-.148a.7.7 0 0 0 .54-.68V7.405a.84.84 0 0 1 .84-.84h1.399a.84.84 0 0 1 .84.84v6.08s.35-.141.691-.285a.7.7 0 0 0 .428-.645V5.306a.84.84 0 0 1 .84-.84h1.4a.84.84 0 0 1 .839.84v5.97c1.213-.88 2.443-1.938 3.419-3.21a1.409 1.409 0 0 0 .214-1.315 9.886 9.886 0 0 0-18.748.222 9.884 9.884 0 0 0 .84 7.946 1.25 1.25 0 0 0 1.193.618c.265-.023.594-.056.986-.103a.699.699 0 0 0 .62-.694V9.5ZM4.163 17.97a9.888 9.888 0 0 0 15.705-7.998c0-.228-.01-.453-.026-.677-3.613 5.388-10.284 7.907-15.679 8.674" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};
