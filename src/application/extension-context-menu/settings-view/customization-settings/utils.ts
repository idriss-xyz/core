import { ExtendedCheckboxOption } from 'shared/ui';

export const getSettingsGroupState = (settingsGroupStates: boolean[]) => {
  if (settingsGroupStates.every(Boolean)) {
    return 'all';
  }
  if (settingsGroupStates.some(Boolean)) {
    return 'some';
  }
  return 'none';
};

export const mapGroupSettingsStateToExtendedCheckbox: (
  state: 'all' | 'some' | 'none',
) => ExtendedCheckboxOption = (state: 'all' | 'some' | 'none') => {
  switch (state) {
    case 'all': {
      return 'checked';
    }
    case 'none': {
      return 'unchecked';
    }
    case 'some': {
      return 'intermediate';
    }
  }
};
