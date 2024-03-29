import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Accordion, AccordionItem } from './Accordion';

const defaultItems: AccordionItem[] = [
  { id: '1', title: 'Section One', content: 'Content for section one' },
  { id: '2', title: 'Section Two', content: 'Content for section two' },
  { id: '3', title: 'Section Three', content: 'Content for section three' },
];

describe('Accordion', () => {
  it('renders all section headings', () => {
    render(<Accordion items={defaultItems} />);
    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByText('Section Two')).toBeInTheDocument();
    expect(screen.getByText('Section Three')).toBeInTheDocument();
  });

  it('starts with all panels collapsed by default', () => {
    render(<Accordion items={defaultItems} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('expands a panel on click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={defaultItems} />);

    const button = screen.getByText('Section One');
    await user.click(button);

    expect(button.closest('button')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content for section one')).toBeVisible();
  });

  it('collapses an expanded panel on second click', async () => {
    const user = userEvent.setup();
    render(<Accordion items={defaultItems} />);

    const button = screen.getByText('Section One');
    await user.click(button);
    await user.click(button);

    expect(button.closest('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('in single mode, expanding one panel collapses others', async () => {
    const user = userEvent.setup();
    render(<Accordion items={defaultItems} />);

    await user.click(screen.getByText('Section One'));
    await user.click(screen.getByText('Section Two'));

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
  });

  it('in multiple mode, multiple panels can be expanded', async () => {
    const user = userEvent.setup();
    render(<Accordion items={defaultItems} multiple />);

    await user.click(screen.getByText('Section One'));
    await user.click(screen.getByText('Section Two'));

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports defaultExpanded', () => {
    render(<Accordion items={defaultItems} defaultExpanded={['2']} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
  });

  it('has correct aria-controls linking header to panel', () => {
    render(<Accordion items={defaultItems} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      const controlsId = button.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      const panel = document.getElementById(controlsId!);
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveAttribute('role', 'region');
    });
  });

  it('panel has aria-labelledby pointing to header', () => {
    render(<Accordion items={defaultItems} />);
    const regions = document.querySelectorAll('[role="region"]');
    regions.forEach((region) => {
      const labelledBy = region.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)).toBeInTheDocument();
    });
  });

  it('navigates between headers with ArrowDown/ArrowUp', async () => {
    const user = userEvent.setup();
    render(<Accordion items={defaultItems} />);
    const buttons = screen.getAllByRole('button');

    buttons[0]!.focus();
    await user.keyboard('{ArrowDown}');
    expect(buttons[1]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(buttons[2]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(buttons[0]).toHaveFocus();
  });

  it('navigates to first/last with Home/End', async () => {
    const user = userEvent.setup();
    render(<Accordion items={defaultItems} />);
    const buttons = screen.getAllByRole('button');

    buttons[1]!.focus();
    await user.keyboard('{Home}');
    expect(buttons[0]).toHaveFocus();

    await user.keyboard('{End}');
    expect(buttons[2]).toHaveFocus();
  });

  it('skips disabled items during keyboard navigation', async () => {
    const user = userEvent.setup();
    const items: AccordionItem[] = [
      { id: '1', title: 'First', content: 'One' },
      { id: '2', title: 'Disabled', content: 'Two', disabled: true },
      { id: '3', title: 'Third', content: 'Three' },
    ];
    render(<Accordion items={items} />);
    const buttons = screen.getAllByRole('button');

    buttons[0]!.focus();
    await user.keyboard('{ArrowDown}');
    expect(buttons[2]).toHaveFocus();
  });

  it('fires onChange with expanded IDs', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Accordion items={defaultItems} onChange={handleChange} />);

    await user.click(screen.getByText('Section One'));
    expect(handleChange).toHaveBeenCalledWith(['1']);
  });
});
