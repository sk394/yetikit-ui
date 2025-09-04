import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
    component: Button,
    tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Click Me',
    },
};

export const Emoji: Story = {
    args: {
        children: '😥',
    },
};
