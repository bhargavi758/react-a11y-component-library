import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Program Overview</h3>
        <p>Stanford's Computer Science department offers rigorous programs at the undergraduate and graduate levels, emphasizing both theory and practical application.</p>
      </div>
    ),
  },
  {
    id: 'curriculum',
    label: 'Curriculum',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Curriculum Details</h3>
        <p>The curriculum includes core courses in algorithms, systems, and artificial intelligence, with elective tracks in HCI, security, and computational biology.</p>
      </div>
    ),
  },
  {
    id: 'faculty',
    label: 'Faculty',
    content: (
      <div>
        <h3 className="font-semibold mb-2">Faculty Members</h3>
        <p>Our faculty includes pioneers in AI, distributed systems, and human-computer interaction with extensive industry and academic experience.</p>
      </div>
    ),
  },
];

export const Horizontal: Story = {
  args: {
    tabs: sampleTabs,
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    tabs: sampleTabs,
    orientation: 'vertical',
  },
};

export const WithDefaultActive: Story = {
  args: {
    tabs: sampleTabs,
    defaultActiveTab: 'curriculum',
  },
};

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      ...sampleTabs,
      { id: 'disabled', label: 'Coming Soon', content: 'N/A', disabled: true },
    ],
  },
};
