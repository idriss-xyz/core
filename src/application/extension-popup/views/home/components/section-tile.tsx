import { classes, Icon } from 'shared/ui';

interface SectionTileIconProperties {
  iconSrc: string;
  iconAlt: string;
}
interface SectionTileProperties {
  title: string;
  subtitle: string;
  icons: SectionTileIconProperties[];
  href?: string;
  disabled?: boolean;
}

export const SectionTile = ({
  icons,
  title,
  subtitle,
  href,
  disabled,
}: SectionTileProperties) => {
  return (
    <a
      href={href}
      className={classes(
        'relative rounded-lg p-4 text-center shadow-md',
        !disabled &&
          'transition-transform duration-[600ms] hover:scale-105 hover:bg-gray-50',
        disabled && 'cursor-not-allowed bg-gray-200 opacity-50',
      )}
    >
      <div className="mb-2 flex justify-center space-x-3">
        {icons.map((icon) => {
          return (
            <img
              key={icon.iconSrc}
              src={icon.iconSrc}
              alt={icon.iconAlt}
              className="size-8 rounded-lg"
            />
          );
        })}
      </div>
      <h2 className="mb-1 text-lg font-semibold text-black">{title}</h2>
      <p className="text-xs text-gray-500">{subtitle}</p>

      {/* <!-- External link icon in the top-right corner --> */}
      {!disabled && !!href && (
        <div className="absolute right-2 top-2">
          <Icon name="ExternalLinkIcon" size={14} className="text-gray-500" />
        </div>
      )}
    </a>
  );
};
