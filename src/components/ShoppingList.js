import React, { useState, useEffect } from 'react';
import ItemForm from './ItemForm';

function ShoppingList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    }
    fetchItems();
  }, []);

  async function addItem(newItem) {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      const data = await response.json();
      setItems([...items, data]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  async function toggleCartStatus(id) {
    const itemToUpdate = items.find((item) => item.id === id);
    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isInCart: !itemToUpdate.isInCart }),
      });
      setItems(items.map((item) => (item.id === id ? { ...item, isInCart: !item.isInCart } : item)));
    } catch (error) {
      console.error('Error toggling cart status:', error);
    }
  }

  async function removeItem(id) {
    try {
      await fetch(`/api/items/${id}`, { method: 'DELETE' });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  return (
    <div>
      <ItemForm addItem={addItem} />
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.isInCart ? 'In Cart' : 'Not in Cart'}
            <button onClick={() => toggleCartStatus(item.id)}>
              {item.isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
            <button onClick={() => removeItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;