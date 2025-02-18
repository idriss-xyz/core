type Properties = {
  size: number;
  className?: string;
};

export const CrownCircled = ({ size, className }: Properties) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.5 6.75a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" fill="currentColor" />
      <path
        d="M2.95 4.312c-.175-.205-.507-.034-.442.228l.966 3.862c.028.114.13.193.248.193h5.556c.118 0 .22-.08.248-.193l.966-3.862c.065-.262-.267-.433-.442-.228L8.437 6.193a.255.255 0 0 1-.415-.039l-1.3-2.275a.255.255 0 0 0-.444 0l-1.3 2.275a.255.255 0 0 1-.415.04L2.95 4.311Z"
        fill="#fff"
      />
    </svg>
  );
};
