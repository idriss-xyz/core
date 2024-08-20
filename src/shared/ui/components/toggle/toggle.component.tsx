import { classes } from 'shared/ui/utils';

import { ToggleProperties } from './toggle.types';

export const Toggle = ({ checked, onCheckedChange }: ToggleProperties) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        checked={checked}
        onChange={(event) => {
          onCheckedChange(event.target.checked);
        }}
        id="toggle"
        type="checkbox"
        className="sr-only"
      />

      <label htmlFor="toggle" className="hidden" />
      <div
        className={classes(
          "mx-4 h-2.5 w-[30px] rounded-[5px] bg-[#bdc1c6] transition-all duration-300 ease-in-out after:absolute after:-top-[5px] after:left-1.5 after:size-5 after:rounded-[10px] after:bg-black after:shadow-[0_1px_3px_0_rgba(0,0,0,0.4)] after:transition-all after:duration-300 after:ease-in-out after:content-['']",
          {
            'bg-[#11dd7488] after:left-[35px] after:bg-[#11dd74]': checked,
          },
        )}
      />
    </label>
  );
};
