import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const sampleItems = [
  {
    id: 'admissions',
    title: 'Undergraduate Admissions',
    content: 'The university accepts applications through the Common Application and the Coalition Application. The acceptance rate is approximately 4%, making it one of the most selective universities in the world.',
  },
  {
    id: 'financial-aid',
    title: 'Financial Aid',
    content: 'The university meets 100% of demonstrated financial need for admitted students. Families with incomes below $75,000 pay no tuition, room, or board.',
  },
  {
    id: 'housing',
    title: 'Campus Housing',
    content: 'The university guarantees four years of on-campus housing for undergraduate students. The residential education program integrates academic and social life.',
  },
  {
    id: 'research',
    title: 'Research Opportunities',
    content: 'Undergraduates can participate in research through programs like the Undergraduate Research Program (URP) and Undergraduate Advising and Research (UAR).',
  },
];

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

export const MultipleExpanded: Story = {
  args: {
    items: sampleItems,
    multiple: true,
  },
};

export const WithDefaultExpanded: Story = {
  args: {
    items: sampleItems,
    defaultExpanded: ['admissions'],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...sampleItems.slice(0, 2),
      { id: 'disabled', title: 'Coming Soon (Disabled)', content: 'Not available yet.', disabled: true },
      ...sampleItems.slice(2),
    ],
  },
};
