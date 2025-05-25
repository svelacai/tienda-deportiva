import React, { useState, createContext } from 'react';

// Crear el contexto 
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('requerimientos');
  const [cart, setCart] = useState([]);
  const [purchaseRequirements, setPurchaseRequirements] = useState({
    buyerName: '',
    maxBudget: '',
    address: '',
    deliveryType: 'domicilio', 
  });

  const navigateTo = (page) => setCurrentPage(page);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingProductIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingProductIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const clearCart = () => setCart([]);

  const clearPurchaseRequirements = () => {
    setPurchaseRequirements({
      buyerName: '',
      maxBudget: '',
      address: '',
      deliveryType: 'domicilio',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigateTo,
        cart,
        addToCart,
        clearCart,
        purchaseRequirements,
        setPurchaseRequirements,
        clearPurchaseRequirements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
