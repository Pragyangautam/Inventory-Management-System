// Get all data
export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Save complete array
export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Add new record
export const addData = (key, item) => {
  const data = getData(key);

  const newItem = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...item,
  };

  data.push(newItem);
  saveData(key, data);

  return newItem;
};

// Update record
export const updateData = (key, item) => {
  const data = getData(key);

  const updated = data.map((record) => (record.id === item.id ? item : record));

  saveData(key, updated);
};

// Delete record
export const deleteData = (key, id) => {
  const data = getData(key);

  const filtered = data.filter((record) => record.id !== id);

  saveData(key, filtered);
};

// Find one record
export const findById = (key, id) => {
  return getData(key).find((item) => item.id === id);
};

// Clear module
export const clearData = (key) => {
  localStorage.removeItem(key);
};
