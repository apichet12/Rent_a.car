import React, { createContext, useState, useEffect } from 'react';
import carsData from '../data/cars';

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    // Load availability จาก localStorage
    const storedAvailability = localStorage.getItem('cars_availability');
    const storedFavorites = localStorage.getItem('cars_favorites');

    const initialCars = carsData.map(c => ({
      ...c,
      available: storedAvailability
        ? JSON.parse(storedAvailability)[c.id] ?? true
        : Math.random() > 0.3
    }));

    setCars(initialCars);
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : {});

    // Save initial availability ถ้ายังไม่มี
    if (!storedAvailability) {
      const map = {};
      initialCars.forEach(x => (map[x.id] = x.available));
      localStorage.setItem('cars_availability', JSON.stringify(map));
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem('cars_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CarContext.Provider value={{ cars, setCars, favorites, toggleFavorite }}>
      {children}
    </CarContext.Provider>
  );
};
