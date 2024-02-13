type AnchorOptions = {
  rel?: string;
  href?: string;
  target?: string;
};

type AllowedTag = 'a' | 'div' | 'button';

type CommonOptions = {
  style?: string;
  textContent?: string;
};

type TagToOptions = {
  a: AnchorOptions;
  div: object;
  button: object;
};

type Options<Tag extends AllowedTag> = TagToOptions[Tag] & CommonOptions;

export const createElement = <Tag extends AllowedTag>(
  tag: Tag,
  options: Options<Tag> = {},
) => {
  const el = document.createElement(tag);

  Object.assign(el, options);

  return el;
};
