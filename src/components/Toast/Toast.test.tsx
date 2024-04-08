import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';

describe('Toast', () => {
  it('renders message with correct role and aria-live', () => {
    render(<Toast id="1" message="File saved" onDismiss={jest.fn()} />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
    expect(screen.getByText('File saved')).toBeInTheDocument();
  });

  it('renders with different severity levels', () => {
    const { rerender } = render(
      <Toast id="1" message="Info toast" severity="info" onDismiss={jest.fn()} />,
    );
    expect(screen.getByText('Information')).toHaveClass('sr-only');

    rerender(
      <Toast id="2" message="Error toast" severity="error" onDismiss={jest.fn()} />,
    );
    expect(screen.getByText('Error')).toHaveClass('sr-only');
  });

  it('calls onDismiss when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleDismiss = jest.fn();
    render(<Toast id="test-1" message="Dismissable" onDismiss={handleDismiss} />);

    await user.click(screen.getByRole('button'));
    expect(handleDismiss).toHaveBeenCalledWith('test-1');
  });

  it('has accessible dismiss button label', () => {
    render(<Toast id="1" message="Test" severity="warning" onDismiss={jest.fn()} />);
    expect(screen.getByLabelText('Dismiss warning notification')).toBeInTheDocument();
  });

  it('auto-dismisses after duration', () => {
    jest.useFakeTimers();
    const handleDismiss = jest.fn();
    render(<Toast id="1" message="Bye" duration={3000} onDismiss={handleDismiss} />);

    expect(handleDismiss).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(handleDismiss).toHaveBeenCalledWith('1');

    jest.useRealTimers();
  });

  it('pauses auto-dismiss on hover', () => {
    jest.useFakeTimers();
    const handleDismiss = jest.fn();
    render(<Toast id="1" message="Hover me" duration={3000} onDismiss={handleDismiss} />);

    const toast = screen.getByRole('status');
    act(() => {
      toast.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(handleDismiss).not.toHaveBeenCalled();

    act(() => {
      toast.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(handleDismiss).toHaveBeenCalledWith('1');

    jest.useRealTimers();
  });
});

describe('ToastProvider', () => {
  function TestConsumer() {
    const { addToast, removeAll } = useToast();
    return (
      <div>
        <button onClick={() => addToast('Success!', 'success')}>Add Toast</button>
        <button onClick={() => addToast('Error!', 'error')}>Add Error</button>
        <button onClick={removeAll}>Clear All</button>
      </div>
    );
  }

  it('renders toasts via context', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Add Toast'));
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('removes all toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Add Toast'));
    await user.click(screen.getByText('Add Error'));
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();

    await user.click(screen.getByText('Clear All'));
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
    expect(screen.queryByText('Error!')).not.toBeInTheDocument();
  });

  it('respects maxToasts limit', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider maxToasts={2}>
        <TestConsumer />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Add Toast'));
    await user.click(screen.getByText('Add Toast'));
    await user.click(screen.getByText('Add Toast'));

    const toasts = screen.getAllByRole('status');
    expect(toasts).toHaveLength(2);
  });

  it('throws error when useToast is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    function BadConsumer() {
      useToast();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      'useToast must be used within a ToastProvider',
    );

    consoleError.mockRestore();
  });

  it('renders the live region container', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    await user.click(screen.getByText('Add Toast'));
    const liveRegion = document.querySelector('[aria-live="polite"][aria-relevant]');
    expect(liveRegion).toBeInTheDocument();
  });
});
