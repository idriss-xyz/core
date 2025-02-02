import { classes } from 'shared/ui/utils';

interface EmptyProperties {
  text?: string;
  className?: string;
}

export const Empty = ({ text, className }: EmptyProperties) => {
  return (
    <div
      className={classes(
        'flex select-none flex-col items-center justify-center gap-y-4',
        className,
      )}
    >
      <svg
        width="105"
        height="67"
        viewBox="0 0 105 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M104.59 28.76 81.633 2.053A5.863 5.863 0 0 0 77.227 0H27.863c-1.693 0-3.303.773-4.406 2.052L.5 28.761v14.661h104.09V28.761Z"
          fill="url(#a)"
        />
        <path
          d="M98.085 43.962 77.992 20.699a5.146 5.146 0 0 0-3.89-1.73H30.988c-1.48 0-2.927.611-3.89 1.73L7.004 43.962v12.776h91.08V43.962Z"
          fill="#F4FFF1"
        />
        <path
          d="M104.59 60.225a6.651 6.651 0 0 1-2.375 5.092l-.295.239a6.637 6.637 0 0 1-4.006 1.336H7.178c-.82 0-1.605-.148-2.33-.42l-.36-.143a6.711 6.711 0 0 1-2.903-2.466A6.662 6.662 0 0 1 .5 60.223V28.92h25.255c2.79 0 5.037 2.284 5.037 5.055v.035c0 2.773 2.274 5.01 5.063 5.01h33.38a5.081 5.081 0 0 0 3.575-1.474 5.03 5.03 0 0 0 1.488-3.555c0-2.782 2.25-5.07 5.037-5.07h25.257l-.002 31.304Z"
          fill="url(#b)"
        />
        <defs>
          <linearGradient
            id="a"
            x1="52.545"
            y1="0"
            x2="52.545"
            y2="43.422"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#56DF34" stopOpacity=".3" />
            <stop offset="1" stopColor="#56DF34" stopOpacity=".2" />
          </linearGradient>
          <linearGradient
            id="b"
            x1="52.546"
            y1="28.92"
            x2="52.546"
            y2="66.892"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#56DF34" stopOpacity=".3" />
            <stop offset="1" stopColor="#56DF34" stopOpacity=".2" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-label5 text-neutral-500">{text}</span>
    </div>
  );
};
