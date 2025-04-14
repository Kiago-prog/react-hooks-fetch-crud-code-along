import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShoppingList from '../components/ShoppingList';

describe('ShoppingList Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays all the items from the server after the initial render', async () => {
    global.fetch.mockResolvedValue({
      json: async () => [
        { id: 1, name: 'Apple', isInCart: false },
        { id: 2, name: 'Banana', isInCart: true },
      ],
    });

    render(<ShoppingList />);

    await waitFor(() => {
      expect(screen.getByText('Apple - Not in Cart')).toBeInTheDocument();
      expect(screen.getByText('Banana - In Cart')).toBeInTheDocument();
    });
  });

  test('adds a new item to the list when the ItemForm is submitted', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] });
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ id: 3, name: 'Orange', isInCart: false }),
    });

    render(<ShoppingList />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Orange' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Item/i }));

    await waitFor(() => {
      expect(screen.getByText('Orange - Not in Cart')).toBeInTheDocument();
    });
  });

  test('updates the isInCart status of an item when the Add/Remove from Cart button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [{ id: 1, name: 'Apple', isInCart: false }],
    });
    global.fetch.mockResolvedValueOnce({});
    render(<ShoppingList />);

    await waitFor(() => screen.getByText('Apple - Not in Cart'));
    fireEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));
    await waitFor(() => screen.getByText('Apple - In Cart'));
  });

  test('removes an item from the list when the delete button is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [{ id: 1, name: 'Apple', isInCart: false }],
    });
    global.fetch.mockResolvedValueOnce({});
    render(<ShoppingList />);

    await waitFor(() => screen.getByText('Apple - Not in Cart'));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.queryByText('Apple - Not in Cart')).toBeNull();
    });
  });
});