import * as RadixForm from '@radix-ui/react-form';

import { Field } from './field';
import { DatePickerField } from './date-picker-field';
import { TagField } from './tagfield';

const FormBase = RadixForm.Form;

export const Form = Object.assign(FormBase, {
  Field,
  DatePickerField,
  TagField,
});
