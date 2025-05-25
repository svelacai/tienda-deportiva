import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Carrito = () => {
  const { navigateTo, cart, clearCart, purchaseRequirements } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = purchaseRequirements.deliveryType === 'domicilio' ? 10.00 : 0;
  const total = subtotal + deliveryCharge;

  const handleExecutePurchase = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setMessage('El carrito está vacío. Agregue productos antes de comprar.');
      return;
    }
    setMessage('');
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = () => {
    setShowConfirmation(false);
    clearCart();
    navigateTo('requerimientos');
    setMessage('¡Compra realizada con éxito! Gracias por tu compra.');
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setMessage('Compra cancelada.');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <nav className="bg-gradient-to-r-purple-pink p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Tu Carrito de Compras</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigateTo('productos')}
            className="btn btn-primary"
          >
            Regresar a Productos
          </button>
          <button
            onClick={() => { clearCart(); navigateTo('requerimientos'); }}
            className="btn btn-red"
          >
            Cancelar Compra
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2\/3 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Compra Actual</h2>
          {cart.length > 0 ? (
            <table className="min-w-full divide-y-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">
                    Producto
                  </th>
                  <th className="table-header">
                    Cantidad
                  </th>
                  <th className="table-header">
                    Precio Unitario
                  </th>
                  <th className="table-header">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y-gray-200">
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="table-row-data font-medium-table">
                      {item.name}
                    </td>
                    <td className="table-row-data text-gray-500-table">
                      {item.quantity}
                    </td>
                    <td className="table-row-data text-gray-500-table">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="table-row-data text-gray-500-table">
                      {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 py-8">Tu carrito está vacío.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1\/3 flex flex-col space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Compra</h2>
            <div className="space-y-2 text-gray-700">
              <p className="flex justify-between">
                <span>Total de productos:</span>
                <span className="font-medium">{cart.length}</span>
              </p>
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Cargo por domicilio:</span>
                <span className="font-medium">${deliveryCharge.toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total a pagar:</span>
                <span>${total.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de Tarjeta de Crédito</h2>
            {message && (
              <div className="alert alert-red">
                <span className="alert-block sm:alert-inline">{message}</span>
              </div>
            )}
            <form onSubmit={handleExecutePurchase} className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Número de Tarjeta:
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="XXXX XXXX XXXX XXXX"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Fecha de Vencimiento (MM/AA):
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/AA"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    CVV:
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="XXX"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                  Nombre en la Tarjeta:
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="Nombre Apellido"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-purple"
              >
                Ejecutar Compra
              </button>
            </form>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirmar Compra</h3>
            <p className="text-gray-700 mb-6">¿Estás seguro de que deseas completar la compra?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmPurchase}
                className="btn btn-green"
              >
                Sí, Confirmar
              </button>
              <button
                onClick={handleCancelConfirmation}
                className="btn btn-red"
              >
                No, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
