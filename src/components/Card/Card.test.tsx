import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Card, CardImage, CardHeader, CardBody, CardActions } from './Card';

describe('Card', () => {
  it('renders as a div by default', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
  });

  it('renders as article when specified', () => {
    render(
      <Card as="article" data-testid="card">
        Content
      </Card>,
    );
    expect(screen.getByTestId('card').tagName).toBe('ARTICLE');
  });

  it('applies elevated variant styles by default', () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('shadow-md');
  });

  it('applies outlined variant styles', () => {
    render(
      <Card variant="outlined" data-testid="card">
        Content
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass('border');
  });

  it('renders as interactive with role button', () => {
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} data-testid="card">
        Click me
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('handles click on interactive card', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} data-testid="card">
        Click me
      </Card>,
    );

    await user.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles Enter key on interactive card', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} data-testid="card">
        Press Enter
      </Card>,
    );

    screen.getByTestId('card').focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles Space key on interactive card', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} data-testid="card">
        Press Space
      </Card>,
    );

    screen.getByTestId('card').focus();
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as link card when href is provided', () => {
    render(
      <Card href="/test" data-testid="card">
        Link Card
      </Card>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('forwards ref to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardImage', () => {
  it('renders an image with alt text', () => {
    render(<CardImage src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('renders with empty alt for decorative images', () => {
    render(<CardImage src="/decorative.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', '');
  });
});

describe('CardHeader', () => {
  it('renders title as h3 by default', () => {
    render(<CardHeader title="Test Title" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Title');
  });

  it('renders with custom heading level', () => {
    render(<CardHeader title="H2 Title" titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2 Title');
  });

  it('renders subtitle when provided', () => {
    render(<CardHeader title="Title" subtitle="Subtitle text" />);
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });
});

describe('CardBody', () => {
  it('renders children', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });
});

describe('CardActions', () => {
  it('renders action buttons', () => {
    render(
      <CardActions>
        <button>Action 1</button>
        <button>Action 2</button>
      </CardActions>,
    );
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });
});
