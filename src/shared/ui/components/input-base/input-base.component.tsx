import { classes } from '../../utils';
import { ErrorMessage } from '../error-message';

import { InputBaseLabel } from './input-base-label.component';
import type { InputBaseComponent } from './input-base.types';

export const InputBase: InputBaseComponent = ({
  children,
  label,
  prefix,
  suffix,
  className,
  ref,
  as,
  errorMessage,
  renderLabel,
  disabled = false,
}) => {
  const Component = as ?? 'label';

  return (
    <Component className="w-full" ref={ref}>
      {renderLabel ? (
        renderLabel()
      ) : label ? (
        <InputBaseLabel className="mb-1.5" label={label} />
      ) : null}
      <div
        className={classes(
          'flex items-center rounded-lg border border-[#2c3f4f] py-4 pl-4 pr-4 outline-none',
          Boolean(prefix) && 'pl-2',
          Boolean(suffix) && 'pr-2',
          disabled && 'bg-light-600',
          errorMessage && 'border-red-500',
          className,
        )}
      >
        {prefix ? <div className="mr-2 flex">{prefix}</div> : null}
        <div className="grow [&>*]:w-full">{children}</div>
        {suffix ? <div className="ml-2 flex">{suffix}</div> : null}
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Component>
  );
};

InputBase.Label = InputBaseLabel;
