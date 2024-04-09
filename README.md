# react-a11y-component-library

Accessible React component library — Button, Modal, Accordion, Tabs, Dropdown, Toast, SkipLink, Card. All follow WAI-ARIA patterns with keyboard nav, focus trapping, screen reader support, etc. WCAG 2.1 AA.

## setup

```bash
npm install
npm run storybook
```

Opens Storybook at localhost:6006 with the a11y addon.

## tests

```bash
npm test
npm run test:coverage
```

## tech

React 18, TypeScript (strict mode), Tailwind, Storybook 8, Jest + RTL

Also includes a few custom hooks — `useFocusTrap`, `useKeyboard`, `usePrefersReducedMotion`.

## todo

- form components (inputs, selects, radio groups)
- publish to npm
- visual regression testing w/ Chromatic
