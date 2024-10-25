import remToPx from 'postcss-rem-to-responsive-pixel';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    remToPx({
      rootValue: 16,
      propList: ['*'],
      transformUnit: 'px',
    }),
  ],
};
