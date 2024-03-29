import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Modal } from './Modal';

function renderModal(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <p>Modal content</p>,
    ...props,
  };
  return { ...render(<Modal {...defaultProps} />), onClose: defaultProps.onClose };
}

describe('Modal', () => {
  it('renders with correct ARIA attributes', () => {
    renderModal();
    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');

    const titleId = dialog.getAttribute('aria-labelledby')!;
    expect(document.getElementById(titleId)).toHaveTextContent('Test Modal');
  });

  it('renders description with aria-describedby when provided', () => {
    renderModal({ description: 'A helpful description' });
    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-describedby');
    const descId = dialog.getAttribute('aria-describedby')!;
    expect(document.getElementById(descId)).toHaveTextContent('A helpful description');
  });

  it('does not render when open is false', () => {
    renderModal({ open: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking the close button', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const closeButton = screen.getByLabelText('Close dialog');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when clicking the overlay', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal();

    const overlay = document.querySelector('[aria-hidden="true"]')!;
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on overlay click when closeOnOverlayClick is false', async () => {
    const user = userEvent.setup();
    const { onClose } = renderModal({ closeOnOverlayClick: false });

    const overlay = document.querySelector('[aria-hidden="true"]')!;
    await user.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('traps focus within the modal', async () => {
    const user = userEvent.setup();
    renderModal({
      children: (
        <div>
          <button>First</button>
          <button>Second</button>
        </div>
      ),
    });

    const dialog = screen.getByRole('dialog');
    const buttons = within(dialog).getAllByRole('button');

    const closeBtn = screen.getByLabelText('Close dialog');
    closeBtn.focus();

    await user.tab();
    expect(buttons[1]).toHaveFocus();

    await user.tab();
    expect(buttons[2]).toHaveFocus();
  });

  it('has a close button accessible to screen readers', () => {
    renderModal();
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('renders children inside the dialog', () => {
    renderModal({ children: <p>Custom content</p> });
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Custom content')).toBeInTheDocument();
  });
});
