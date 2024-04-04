import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Tabs, TabItem } from './Tabs';

const defaultTabs: TabItem[] = [
  { id: 'tab1', label: 'Tab One', content: 'Content One' },
  { id: 'tab2', label: 'Tab Two', content: 'Content Two' },
  { id: 'tab3', label: 'Tab Three', content: 'Content Three' },
];

describe('Tabs', () => {
  it('renders all tab buttons in a tablist', () => {
    render(<Tabs tabs={defaultTabs} />);
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('first tab is active by default', () => {
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('shows content for the active tab', () => {
    render(<Tabs tabs={defaultTabs} />);
    expect(screen.getByText('Content One')).toBeVisible();
    expect(screen.getByText('Content Two')).not.toBeVisible();
  });

  it('switches tabs on click', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);

    await user.click(screen.getByRole('tab', { name: 'Tab Two' }));

    expect(screen.getByRole('tab', { name: 'Tab Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content Two')).toBeVisible();
    expect(screen.getByText('Content One')).not.toBeVisible();
  });

  it('supports defaultActiveTab', () => {
    render(<Tabs tabs={defaultTabs} defaultActiveTab="tab2" />);
    expect(screen.getByRole('tab', { name: 'Tab Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content Two')).toBeVisible();
  });

  it('active tab has tabIndex 0, inactive tabs have tabIndex -1', () => {
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');

    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  it('each tab has aria-controls pointing to its panel', () => {
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel', { hidden: true });

    tabs.forEach((tab, index) => {
      const controlsId = tab.getAttribute('aria-controls');
      expect(controlsId).toBe(panels[index]!.id);
    });
  });

  it('each panel has aria-labelledby pointing to its tab', () => {
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel', { hidden: true });

    panels.forEach((panel, index) => {
      expect(panel.getAttribute('aria-labelledby')).toBe(tabs[index]!.id);
    });
  });

  it('navigates tabs with ArrowRight/ArrowLeft', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');

    tabs[0]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
  });

  it('navigates with ArrowLeft wrapping', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');

    tabs[0]!.focus();
    await user.keyboard('{ArrowLeft}');
    expect(tabs[2]).toHaveFocus();
  });

  it('Home goes to first tab, End goes to last', async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={defaultTabs} />);
    const tabs = screen.getAllByRole('tab');

    tabs[1]!.focus();
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();

    await user.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();
  });

  it('skips disabled tabs during keyboard navigation', async () => {
    const user = userEvent.setup();
    const tabsWithDisabled: TabItem[] = [
      { id: '1', label: 'First', content: 'First' },
      { id: '2', label: 'Disabled', content: 'Disabled', disabled: true },
      { id: '3', label: 'Third', content: 'Third' },
    ];
    render(<Tabs tabs={tabsWithDisabled} />);
    const tabs = screen.getAllByRole('tab');

    tabs[0]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();
  });

  it('fires onChange callback', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Tabs tabs={defaultTabs} onChange={handleChange} />);

    await user.click(screen.getByRole('tab', { name: 'Tab Two' }));
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('sets aria-orientation correctly', () => {
    const { rerender } = render(<Tabs tabs={defaultTabs} />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');

    rerender(<Tabs tabs={defaultTabs} orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('tabpanel is focusable with tabIndex 0', () => {
    render(<Tabs tabs={defaultTabs} />);
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('tabindex', '0');
  });
});
