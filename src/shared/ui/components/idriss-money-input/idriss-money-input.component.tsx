import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

import { classes } from 'shared/ui/utils';

import { ErrorMessage } from '../error-message';
import { Icon } from '../icon';

import { IdrissMoneyInputProperties } from './idriss-money-input.types';
import { IdrissMoneyButton } from './idriss-money-button.component';
import { VALUES_TO_PICK } from './idriss-money-input.constants';

export const IdrissMoneyInput = ({
  value,
  onChange,
  className,
  errorMessage,
}: IdrissMoneyInputProperties) => {
  const [isManual, setIsManual] = useState(false);

  return (
    <div>
      <div className={classes('flex space-x-1', className)}>
        {VALUES_TO_PICK.map((valueToPick) => {
          return (
            <IdrissMoneyButton
              isActive={!isManual && valueToPick === value}
              key={valueToPick}
              onClick={() => {
                setIsManual(false);
                onChange(valueToPick);
              }}
            >
              ${valueToPick}
            </IdrissMoneyButton>
          );
        })}
        <IdrissMoneyButton
          onClick={() => {
            if (!isManual) {
              setIsManual(true);
              onChange(0);
            }
          }}
          isActive={isManual}
          className="flex w-full items-center justify-center px-0.5"
        >
          {isManual ? (
            <NumericFormat
              allowNegative={false}
              onChange={(event) => {
                const newValueAsNumber = Number(
                  event.target.value.replace('$', ''),
                );
                onChange(newValueAsNumber);
              }}
              value={value}
              decimalScale={3}
              prefix="$"
              className="w-full bg-transparent text-center outline-none placeholder:text-black"
              autoFocus
            />
          ) : (
            <Icon name="Pencil1Icon" />
          )}
        </IdrissMoneyButton>
      </div>
      {errorMessage ? (
        <ErrorMessage className="text-right">{errorMessage}</ErrorMessage>
      ) : null}
    </div>
  );
};
