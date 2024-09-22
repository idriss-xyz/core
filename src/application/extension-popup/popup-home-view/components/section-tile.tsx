import { classes } from 'shared/ui';

interface SectionTileIconProperties {
  iconSrc: string;
  iconAlt: string;
  className?: string;
}
interface SectionTileProperties {
  title: string;
  subtitle: string;
  icons: SectionTileIconProperties[];
  href?: string;
  disabled?: boolean;
  iconContainerClassName?: string;
}

export const SectionTile = ({
  icons,
  title,
  subtitle,
  href,
  disabled,
  iconContainerClassName,
}: SectionTileProperties) => {
  return (
    <a
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={classes(
        'relative rounded-lg p-4 text-center shadow-md',
        !disabled &&
          'transition-transform duration-[600ms] hover:scale-105 hover:bg-gray-50',
        disabled && 'cursor-not-allowed bg-gray-200 opacity-50',
      )}
    >
      <div
        className={classes(
          'mb-2 flex justify-center space-x-3',
          iconContainerClassName,
        )}
      >
        {icons.map((icon) => {
          return (
            <img
              key={icon.iconSrc}
              src={icon.iconSrc}
              alt={icon.iconAlt}
              className={classes('size-8 rounded-lg', icon.className)}
            />
          );
        })}
      </div>
      <h2 className="mb-1 text-base font-semibold text-black">{title}</h2>
      <p className="text-xs text-gray-500">{subtitle}</p>

      {/* <!-- External link icon in the top-right corner --> */}
      {!disabled && !!href && (
        <div className="absolute right-2 top-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-3.5 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </a>
  );
};
