import type { Preview } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../lib/tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    decorators: [
      withThemeByDataAttribute({
        themes: {
          light: 'light',
          dark: 'dark',
        },
        defaultTheme: 'dark',
        attributeName: 'data-mode',
      }),
    ],
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
