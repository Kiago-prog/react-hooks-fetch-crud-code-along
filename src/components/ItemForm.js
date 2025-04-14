import React, { useState } from 'react';

function ItemForm({ addItem }) {
  const [itemName, setItemName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addItem({ name: itemName, isInCart: false });
    setItemName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default ItemForm;