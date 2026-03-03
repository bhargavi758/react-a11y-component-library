import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardImage, CardHeader, CardBody, CardActions } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    as: {
      control: 'select',
      options: ['div', 'article', 'section'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardImage
        src="https://placehold.co/400x225/2563EB/FFFFFF?text=University"
        alt="University campus"
      />
      <CardHeader
        title="Computer Science Program"
        subtitle="School of Engineering"
      />
      <CardBody>
        Our CS program consistently ranks among the top in the world, offering rigorous
        coursework alongside groundbreaking research opportunities.
      </CardBody>
      <CardActions>
        <Button size="sm" variant="outline">Learn More</Button>
        <Button size="sm">Apply</Button>
      </CardActions>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="max-w-sm">
      <CardHeader title="Research Lab" subtitle="Computer Science Building" />
      <CardBody>
        The Artificial Intelligence Laboratory (AIL) is one of the leading
        centers of AI research in the world.
      </CardBody>
      <CardActions>
        <Button size="sm" variant="ghost">Visit Website</Button>
      </CardActions>
    </Card>
  ),
};

export const Filled: Story = {
  render: () => (
    <Card variant="filled" className="max-w-sm">
      <CardHeader title="Upcoming Event" subtitle="March 15, 2026" />
      <CardBody>
        Annual Computer Forum — bringing together industry leaders and
        academic researchers for a day of talks and networking.
      </CardBody>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card
      interactive
      onClick={() => alert('Card clicked!')}
      className="max-w-sm"
    >
      <CardHeader title="Click Me" subtitle="Interactive card" />
      <CardBody>
        This card is interactive. You can click it or press Enter/Space when focused.
      </CardBody>
    </Card>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Card href="https://www.example.edu" className="max-w-sm">
      <CardHeader title="University" subtitle="example.edu" />
      <CardBody>
        Click anywhere on this card to navigate to the university website.
      </CardBody>
    </Card>
  ),
};

export const WithoutImage: Story = {
  render: () => (
    <Card as="article" className="max-w-sm">
      <CardHeader title="Text-Only Card" />
      <CardBody>
        Cards work perfectly without images too. Use them for text-heavy content
        like announcements or brief descriptions.
      </CardBody>
      <CardActions align="between">
        <Button size="sm" variant="ghost">Dismiss</Button>
        <Button size="sm">Read More</Button>
      </CardActions>
    </Card>
  ),
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['AI Research', 'Systems', 'Theory'].map((area) => (
        <Card key={area} as="article">
          <CardImage
            src={`https://placehold.co/400x225/2563EB/FFFFFF?text=${area.replace(' ', '+')}`}
            alt={`${area} research area`}
          />
          <CardHeader title={area} subtitle="Research Area" />
          <CardBody>
            Explore our {area.toLowerCase()} research programs and find opportunities
            to contribute to cutting-edge work.
          </CardBody>
          <CardActions>
            <Button size="sm" variant="outline">Explore</Button>
          </CardActions>
        </Card>
      ))}
    </div>
  ),
};
