const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    '../../commons/src/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003971',
        blue: '#2C3D94',
        disabled: '#00000040',
        link: '#005AAA',
      },
    },
  },
  plugins: [],
};
