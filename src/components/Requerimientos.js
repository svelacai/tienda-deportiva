import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Requerimientos = () => {
  const { navigateTo, purchaseRequirements, setPurchaseRequirements, clearPurchaseRequirements, clearCart } = useContext(AppContext);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseRequirements((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleStartPurchase = () => {
    
    if (!purchaseRequirements.buyerName || !purchaseRequirements.maxBudget || !purchaseRequirements.address) {
      setMessage('Por favor, complete todos los campos obligatorios.');
      return;
    }
    setMessage(''); 
    navigateTo('productos'); 
  };

  
  const handleClearFields = () => {
    clearPurchaseRequirements(); 
    clearCart(); 
    setMessage(''); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ¡Bienvenido a la Tienda de Implementos Deportivos!
        </h1>

        {}
        {message && (
          <div className="alert alert-red">
            <span className="alert-block sm:alert-inline">{message}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700">
              Nombre de quien compra:
            </label>
            <input
              type="text"
              id="buyerName"
              name="buyerName"
              value={purchaseRequirements.buyerName}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="maxBudget" className="block text-sm font-medium text-gray-700">
              Presupuesto máximo:
            </label>
            <input
              type="number"
              id="maxBudget"
              name="maxBudget"
              value={purchaseRequirements.maxBudget}
              onChange={handleChange}
              placeholder="Ej: 50000"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={purchaseRequirements.address}
              onChange={handleChange}
              placeholder="Tu dirección de envío"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de entrega:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryType"
                  value="domicilio"
                  checked={purchaseRequirements.deliveryType === 'domicilio'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 text-gray-700">Domicilio</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryType"
                  value="recoger"
                  checked={purchaseRequirements.deliveryType === 'recoger'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 text-gray-700">Recoger en tienda</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between space-x-4">
          <button
            onClick={handleStartPurchase}
            className="flex-1 btn btn-primary"
          >
            Iniciar Compra
          </button>
          <button
            onClick={handleClearFields}
            className="flex-1 btn btn-secondary"
          >
            Limpiar Campos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Requerimientos;
