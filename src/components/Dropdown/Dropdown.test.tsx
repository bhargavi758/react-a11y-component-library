import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Dropdown, DropdownOption } from './Dropdown';

const defaultOptions: DropdownOption[] = [
  { value: 'cs', label: 'Computer Science' },
  { value: 'ee', label: 'Electrical Engineering' },
  { value: 'me', label: 'Mechanical Engineering' },
  { value: 'bio', label: 'Biology' },
];

function renderDropdown(props: Partial<React.ComponentProps<typeof Dropdown>> = {}) {
  const defaultProps = {
    options: defaultOptions,
    label: 'Department',
    ...props,
  };
  return render(<Dropdown {...defaultProps} />);
}

describe('Dropdown', () => {
  it('renders with label and placeholder', () => {
    renderDropdown();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Select an option');
  });

  it('has correct ARIA attributes on trigger', () => {
    renderDropdown();
    const trigger = screen.getByRole('combobox');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-labelledby');
  });

  it('opens on click and shows listbox', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
  });

  it('selects an option on click', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    renderDropdown({ onChange: handleChange });

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Biology' }));

    expect(handleChange).toHaveBeenCalledWith('bio');
    expect(screen.getByRole('combobox')).toHaveTextContent('Biology');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens with ArrowDown key', async () => {
    const user = userEvent.setup();
    renderDropdown();

    screen.getByRole('combobox').focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens with Enter key', async () => {
    const user = userEvent.setup();
    renderDropdown();

    screen.getByRole('combobox').focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens with Space key', async () => {
    const user = userEvent.setup();
    renderDropdown();

    screen.getByRole('combobox').focus();
    await user.keyboard(' ');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes with Escape', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('navigates options with ArrowDown/ArrowUp', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');

    listbox.focus();
    await user.keyboard('{ArrowDown}');

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-activedescendant');
  });

  it('selects with Enter in listbox', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    renderDropdown({ onChange: handleChange });

    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    listbox.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalled();
  });

  it('skips disabled options during keyboard navigation', async () => {
    const user = userEvent.setup();
    const optionsWithDisabled: DropdownOption[] = [
      { value: '1', label: 'First' },
      { value: '2', label: 'Disabled', disabled: true },
      { value: '3', label: 'Third' },
    ];
    renderDropdown({ options: optionsWithDisabled });

    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    listbox.focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');

    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveAttribute('aria-disabled', 'true');
  });

  it('marks selected option with aria-selected', async () => {
    const user = userEvent.setup();
    renderDropdown({ defaultValue: 'cs' });

    await user.click(screen.getByRole('combobox'));
    const selectedOption = screen.getByRole('option', { name: 'Computer Science' });
    expect(selectedOption).toHaveAttribute('aria-selected', 'true');
  });

  it('shows error state', () => {
    renderDropdown({ error: 'Selection required' });
    expect(screen.getByRole('alert')).toHaveTextContent('Selection required');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is disabled when disabled prop is set', () => {
    renderDropdown({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('supports controlled value', () => {
    renderDropdown({ value: 'ee' });
    expect(screen.getByRole('combobox')).toHaveTextContent('Electrical Engineering');
  });

  it('supports typeahead search', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    listbox.focus();
    await user.keyboard('b');

    const trigger = screen.getByRole('combobox');
    expect(trigger.getAttribute('aria-activedescendant')).toBeTruthy();
  });
});
