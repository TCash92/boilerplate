import { useMemo, useState } from 'react';
import './App.css';

type InventoryItem = {
  id: string;
  name: string;
  location: string;
  systemCount: number;
  physicalCount: number;
};

const startingInventory: InventoryItem[] = [
  { id: 'widget-a', name: 'Widget A', location: 'Aisle 1', systemCount: 110, physicalCount: 102 },
  { id: 'widget-b', name: 'Widget B', location: 'Aisle 5', systemCount: 250, physicalCount: 260 },
  { id: 'widget-c', name: 'Widget C', location: 'Backroom', systemCount: 75, physicalCount: 75 },
];

const formatCount = (value: number) => value.toLocaleString('en-US');

const formatSignedValue = (value: number) => {
  if (value === 0) return '0';
  const sign = value > 0 ? '+' : '-';
  return `${sign}${Math.abs(value).toLocaleString('en-US')}`;
};

function App() {
  const [items, setItems] = useState<InventoryItem[]>(startingInventory);
  const [showOnlyOutOfBalance, setShowOnlyOutOfBalance] = useState(false);

  const { totalVariance, outOfBalanceCount } = useMemo(() => {
    const variance = items.reduce(
      (sum, item) => sum + (item.physicalCount - item.systemCount),
      0
    );
    const outOfBalance = items.filter(
      (item) => item.physicalCount !== item.systemCount
    ).length;
    return { totalVariance: variance, outOfBalanceCount: outOfBalance };
  }, [items]);

  const visibleItems = showOnlyOutOfBalance
    ? items.filter((item) => item.physicalCount !== item.systemCount)
    : items;

  const handlePhysicalChange = (id: string, nextValue: number) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (Number.isNaN(nextValue)) return item;
        const normalized = Math.max(0, Math.round(nextValue));
        return { ...item, physicalCount: normalized };
      })
    );
  };

  const handleReconcile = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, physicalCount: item.systemCount } : item
      )
    );
  };

  return (
    <main className="app">
      <header className="app__header">
        <h1>Inventory Reconciliation</h1>
        <p>
          Track discrepancies between system records and physical counts so you
          can reconcile stock before it hits customers.
        </p>
      </header>

      <section className="app__summary" aria-live="polite">
        <div>
          <span className="summary__label">Total items</span>
          <span className="summary__value">{items.length}</span>
        </div>
        <div>
          <span className="summary__label">Out of balance</span>
          <span
            className={`summary__value ${
              outOfBalanceCount === 0 ? 'balanced' : 'needs-attention'
            }`}
          >
            {outOfBalanceCount}
          </span>
        </div>
        <div>
          <span className="summary__label">Net variance</span>
          <span
            className={`summary__value variance ${
              totalVariance === 0
                ? 'variance-zero'
                : totalVariance > 0
                ? 'variance-positive'
                : 'variance-negative'
            }`}
          >
            {formatSignedValue(totalVariance)}
          </span>
        </div>
      </section>

      <section className="app__controls">
        <button
          type="button"
          onClick={() => setShowOnlyOutOfBalance((value) => !value)}
          className={showOnlyOutOfBalance ? 'toggle is-active' : 'toggle'}
        >
          {showOnlyOutOfBalance
            ? 'Show all inventory'
            : 'Show only out-of-balance'}
        </button>
      </section>

      {visibleItems.length === 0 ? (
        <p className="app__empty" role="status">
          {showOnlyOutOfBalance
            ? 'All items are reconciled – great work!'
            : 'No inventory items to display.'}
        </p>
      ) : (
        <div className="app__table">
          <table>
            <caption className="sr-only">Current inventory status</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Location</th>
                <th scope="col" className="numeric">
                  System count
                </th>
                <th scope="col" className="numeric">
                  Physical count
                </th>
                <th scope="col" className="numeric">
                  Variance
                </th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => {
                const variance = item.physicalCount - item.systemCount;
                const varianceClass =
                  variance === 0
                    ? 'variance-zero'
                    : variance > 0
                    ? 'variance-positive'
                    : 'variance-negative';

                return (
                  <tr key={item.id}>
                    <th scope="row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-meta">SKU {item.id}</span>
                    </th>
                    <td>{item.location}</td>
                    <td className="numeric">{formatCount(item.systemCount)}</td>
                    <td className="numeric">
                      <label className="sr-only" htmlFor={`${item.id}-input`}>
                        Physical count for {item.name}
                      </label>
                      <input
                        id={`${item.id}-input`}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={item.physicalCount}
                        onChange={(event) =>
                          handlePhysicalChange(
                            item.id,
                            Number(event.target.value)
                          )
                        }
                        aria-label={`Physical count for ${item.name}`}
                      />
                    </td>
                    <td
                      className={`numeric variance-cell ${varianceClass}`}
                      data-testid={`variance-${item.id}`}
                    >
                      {formatSignedValue(variance)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => handleReconcile(item.id)}
                        disabled={variance === 0}
                        aria-label={`Match system count for ${item.name}`}
                      >
                        Match system count
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default App;
