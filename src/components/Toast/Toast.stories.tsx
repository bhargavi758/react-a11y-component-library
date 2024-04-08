import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button/Button';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: {
    id: '1',
    message: 'Your preferences have been updated.',
    severity: 'info',
    onDismiss: () => {},
  },
};

export const Success: Story = {
  args: {
    id: '2',
    message: 'Application submitted successfully!',
    severity: 'success',
    onDismiss: () => {},
  },
};

export const Warning: Story = {
  args: {
    id: '3',
    message: 'Your session will expire in 5 minutes.',
    severity: 'warning',
    onDismiss: () => {},
  },
};

export const Error: Story = {
  args: {
    id: '4',
    message: 'Failed to save changes. Please try again.',
    severity: 'error',
    onDismiss: () => {},
  },
};

function ToastDemo() {
  const { addToast, removeAll } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" onClick={() => addToast('Information message', 'info')}>
        Info Toast
      </Button>
      <Button variant="primary" onClick={() => addToast('Operation successful!', 'success')}>
        Success Toast
      </Button>
      <Button variant="outline" onClick={() => addToast('Please review your input', 'warning')}>
        Warning Toast
      </Button>
      <Button variant="outline" onClick={() => addToast('Something went wrong', 'error')}>
        Error Toast
      </Button>
      <Button variant="ghost" onClick={removeAll}>
        Clear All
      </Button>
    </div>
  );
}

export const Interactive: Story = {
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <Story />
      </ToastProvider>
    ),
  ],
  render: () => <ToastDemo />,
};

export const AllSeverities: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <Toast id="1" message="Information toast" severity="info" onDismiss={() => {}} duration={0} />
      <Toast id="2" message="Success toast" severity="success" onDismiss={() => {}} duration={0} />
      <Toast id="3" message="Warning toast" severity="warning" onDismiss={() => {}} duration={0} />
      <Toast id="4" message="Error toast" severity="error" onDismiss={() => {}} duration={0} />
    </div>
  ),
};
