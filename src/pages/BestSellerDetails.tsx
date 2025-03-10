import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BestProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Fetch all best-selling products
        const response = await fetch('https://api.tamkeen.center/api/best-selling-products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        
        // Find the product that matches the ID from the URL
        const matchedProduct = products.find(
          (prod) => prod.id === parseInt(id)
        );

        if (!matchedProduct) {
          throw new Error('Product not found');
        }

        setProduct(matchedProduct);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Function to render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(parseFloat(rating));
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-2xl ${star <= fullStars ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: {error}
      </div>
    );
  }

  if (!product) {
    return <div className="text-center p-8">No product found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Product Header */}
        <div className="bg-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center mt-2">
            {renderStars(product.rating)}
            <span className="ml-2 text-gray-600">({product.rating}) | {product.orders_count} Orders</span>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <span className="font-bold">Description:</span>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold">Price:</span>
                  <p className="text-blue-600 text-xl">
                    ${product.discounted_price}
                    {product.discounted_price !== product.price && (
                      <span className="text-gray-500 line-through ml-2">
                        ${product.price}
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <span className="font-bold">Total Sales:</span>
                  <p>${product.total_sales}</p>
                </div>

                <div>
                  <span className="font-bold">Color:</span>
                  <p>{product.color || 'N/A'}</p>
                </div>

                <div>
                  <span className="font-bold">Size:</span>
                  <p>{product.size || 'N/A'}</p>
                </div>

                <div>
                  <span className="font-bold">Stock:</span>
                  <p>{product.stock} available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images Placeholder */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Product Images</h2>
            <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
              {product.cover_image ? (
                <img 
                  src={product.cover_image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>

            {/* Variants Section */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Available Variants</h3>
                <div className="grid grid-cols-3 gap-4">
                  {product.variants.map((variant, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg p-2 text-center hover:bg-gray-100 cursor-pointer"
                    >
                      <p>{variant.name || `Variant ${index + 1}`}</p>
                      <p className="text-sm text-gray-600">${variant.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-100 p-6 flex justify-between">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition">
            Add to Cart
          </button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BestProductDetails;