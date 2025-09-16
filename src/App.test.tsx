import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the inventory reconciliation overview', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /inventory reconciliation/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/net variance/i)).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /show only out-of-balance/i })
    ).toBeInTheDocument();
  });

  it('updates variance when physical counts are adjusted', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/physical count for widget a/i);
    await user.clear(input);
    await user.type(input, '115');

    await waitFor(() =>
      expect(screen.getByTestId('variance-widget-a')).toHaveTextContent('+5')
    );

    const reconcileButton = screen.getByRole('button', {
      name: /match system count for widget a/i,
    });
    await user.click(reconcileButton);

    await waitFor(() =>
      expect(screen.getByTestId('variance-widget-a')).toHaveTextContent('0')
    );
    expect(input).toHaveValue(110);
  });

  it('can filter to only the items that need reconciliation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = screen.getByRole('button', {
      name: /show only out-of-balance/i,
    });
    await user.click(toggle);

    await waitFor(() =>
      expect(toggle).toHaveTextContent(/show all inventory/i)
    );

    expect(
      screen.queryByRole('rowheader', { name: /widget c/i })
    ).not.toBeInTheDocument();

    const rowHeaders = screen.getAllByRole('rowheader');
    expect(rowHeaders).toHaveLength(2);
    expect(within(rowHeaders[0]).getByText(/widget a/i)).toBeInTheDocument();
    expect(within(rowHeaders[1]).getByText(/widget b/i)).toBeInTheDocument();
  });
});
