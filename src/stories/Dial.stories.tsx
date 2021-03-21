// Dial.stories.tsx

import React from 'react';

import { Story } from '@storybook/react';
import { DialProps, Dial } from '../components/Dial';

//👇 This default export determines where your story goes in the story list
export default {
    title: 'Dial',
    component: Dial,
};

//👇 We create a “template” of how args map to rendering
const Template: Story<DialProps> = (args) => <Dial {...args} />;

export const ShutterSpeed = Template.bind({});

ShutterSpeed.args = {
    min: 0,
    max: 100,
};