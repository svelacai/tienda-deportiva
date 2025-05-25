import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { mockProducts } from '../data/mockProducts';

const Productos = () => {
  const { navigateTo, addToCart, clearCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ category: '', brand: '' });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const listRef = useRef(null);

  const itemsPerPage = 6;

  const fetchProducts = useCallback((currentPage) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = currentPage * itemsPerPage;
        const newProducts = mockProducts.slice(startIndex, startIndex + itemsPerPage);
        resolve(newProducts);
      }, 500);
    });
  }, []);

  useEffect(() => {
    setProducts([]);
    setAllProducts([]);
    setPage(0);
    setHasMore(true);
    setSelectedProduct(null);
    fetchProducts(0).then((data) => {
      setAllProducts(data);
      setProducts(data);
      setLoading(false);
      setHasMore(data.length === itemsPerPage);
    });
  }, [fetchProducts]);

  useEffect(() => {
    let filtered = allProducts;
    if (filters.category) {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    }
    setProducts(filtered);
  }, [filters, allProducts]);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
        setLoading(true);
        const nextPage = page + 1;
        fetchProducts(nextPage).then((newItems) => {
          if (newItems.length > 0) {
            setAllProducts((prev) => [...prev, ...newItems]);
            setPage(nextPage);
            setHasMore(newItems.length === itemsPerPage);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        });
      }
    }
  }, [loading, hasMore, page, fetchProducts]);

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
  };

  const clearFilters = () => {
    setFilters({ category: '', brand: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-gradient-to-r-blue-indigo p-4 shadow-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Explora Nuestros Productos Deportivos</h1>
        <div className="space-x-4">
          <button
            onClick={() => { clearCart(); navigateTo('requerimientos'); }}
            className="btn btn-red"
          >
            Cancelar Compra
          </button>
          <button
            onClick={() => navigateTo('carrito')}
            className="btn btn-green"
          >
            Completar Compra
          </button>
        </div>
      </nav>

      <div className="bg-white p-6 rounded-lg shadow-md m-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <h2 className="text-xl font-semibold text-gray-800">Filtros de Búsqueda</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="flex-1">
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700">
              Categoría:
            </label>
            <input
              type="text"
              id="filterCategory"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Ej: Fútbol, Fitness"
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filterBrand" className="block text-sm font-medium text-gray-700">
              Marca:
            </label>
            <input
              type="text"
              id="filterBrand"
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              placeholder="Ej: Nike, Adidas"
              className="w-full"
            />
          </div>
          <div className="flex space-x-2 self-end">
            <button
              onClick={applyFilters}
              className="btn btn-indigo"
            >
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div
          ref={listRef}
          className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3 overflow-y-auto custom-scrollbar"
          style={{ maxHeight: 'calc(100vh - 260px)' }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-product-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0E0E0/000000?text=No+Image'; }}
                  />
                  <h3 className="font-semibold text-lg text-gray-900 truncate w-full">{product.name}</h3>
                  <p className="text-gray-600 text-sm">Categoría: {product.category}</p>
                  <p className="text-gray-600 text-sm">Marca: {product.brand}</p>
                  <p className="text-blue-600 font-bold text-xl mt-2">${product.price.toFixed(2)}</p>
                  <p className={`text-sm ${product.availability ? 'text-green-600' : 'text-red-600'}`}>
                    {product.availability ? 'Disponible' : 'No Disponible'}
                  </p>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="mt-4 w-full btn btn-primary"
                  >
                    Ver Detalle
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">No se encontraron productos.</p>
            )}
          </div>
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-2">Cargando más productos...</p>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <p className="text-center text-gray-500 mt-4">Has llegado al final de la lista.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle del Producto</h2>
          {selectedProduct ? (
            <div className="flex flex-col items-center text-center">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="img-product-md"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/E0E0E0/000000?text=No+Image'; }}
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Categoría:</span> {selectedProduct.category}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Marca:</span> {selectedProduct.brand}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Precio:</span> ${selectedProduct.price.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Disponibilidad:</span>{' '}
                <span className={selectedProduct.availability ? 'text-green-600' : 'text-red-600'}>
                  {selectedProduct.availability ? 'En Stock' : 'Agotado'}
                </span>
              </p>
              {Object.entries(selectedProduct).map(([key, value]) => {
                if (['id', 'name', 'price', 'category', 'brand', 'availability', 'imageUrl', 'description'].includes(key)) {
                  return null;
                }
                return (
                  <p key={key} className="text-gray-700 mb-1">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {String(value)}
                  </p>
                );
              })}
              <p className="text-gray-800 text-sm mt-2">{selectedProduct.description}</p>

              <button
                onClick={() => addToCart(selectedProduct)}
                disabled={!selectedProduct.availability}
                className={`w-full btn ${selectedProduct.availability ? 'btn-green' : 'btn-disabled'}`}
              >
                {selectedProduct.availability ? 'Agregar al Carrito' : 'Producto no disponible'}
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-8">Selecciona un producto de la lista para ver sus detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productos;