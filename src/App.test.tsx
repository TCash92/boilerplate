import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders heading text', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /react \+ typescript boilerplate/i })
    ).toBeInTheDocument();
  });
});
