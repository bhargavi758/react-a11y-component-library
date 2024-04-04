import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const departments = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'ee', label: 'Electrical Engineering' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'bio', label: 'Biology' },
  { value: 'chem', label: 'Chemistry' },
  { value: 'phys', label: 'Physics' },
  { value: 'math', label: 'Mathematics' },
  { value: 'stat', label: 'Statistics' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    label: 'Department',
    options: departments,
    placeholder: 'Choose a department',
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'Department',
    options: departments,
    defaultValue: 'cs',
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: 'Department',
    options: [
      ...departments.slice(0, 3),
      { value: 'closed', label: 'Enrollment Closed', disabled: true },
      ...departments.slice(3),
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'Department',
    options: departments,
    error: 'Please select a department',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Department',
    options: departments,
    disabled: true,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('ee');
    return (
      <div>
        <Dropdown
          label="Department"
          options={departments}
          value={value}
          onChange={setValue}
        />
        <p className="mt-2 text-sm text-stanford-cool-grey">
          Selected: {value}
        </p>
      </div>
    );
  },
};
