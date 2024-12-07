import * as RadixForm from '@radix-ui/react-form';

import { Field } from './field';

const FormBase = RadixForm.Form;

export const Form = Object.assign(FormBase, {
  Field,
});
