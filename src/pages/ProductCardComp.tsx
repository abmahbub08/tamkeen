import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { authAtom } from '../atoms/authAtom';

// Types and Interfaces
type Product = {
    id: number;
    store_id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    cover_image: string | null;
    color: string | null;
    size: string | null;
    discounted_price: string;
    rating: string;
    orders_count: number;
    quantity?: number;
};

interface CartItem {
    store_id: number;
    product_id: number;
    quantity: number;
}

// Cart Service
export const cartService = {
    async addToCart(product: Product) {
        try {
            // Get the authentication token from cookies
            const token = Cookies.get('token');

            // Check if user is authenticated
            if (!token) {
                // Redirect to login or handle authentication
                window.location.href = '/login';
                return null;
            }

            // Prepare cart item payload
            const cartItemPayload: CartItem = {
                store_id: product.store_id,
                product_id: product.id,
                quantity: product.quantity || 1
            };

            // Make the API call
            const response = await axios.post(
                'https://api.tamkeen.center/api/cart/add', 
                {
                    cartItems: [cartItemPayload]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Handle successful response
            return response.data;
        } catch (error) {
            // Handle errors
            console.error('Error adding to cart:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(error.response.data.message || 'Failed to add item to cart');
                } else if (error.request) {
                    toast.error('No response from server');
                } else {
                    toast.error('Error adding item to cart');
                }
            }

            throw error;
        }
    }
};

// Product Card Component
type ProductCardProps = {
    product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const [auth] = useAtom(authAtom);

    const addToCart = async () => {
        // Validate authentication and stock
        // if (!auth.isAuthenticated) {
        //     navigate("/login");
        //     return;
        // }

        if (product.stock === 0) {
            toast.error('Product out of stock');
            return;
        }

        try {
            // Call cart service to add item
            const response = await cartService.addToCart(product);

            if (response) {
                // Optionally update local storage or global state
                const existingCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const existingProductIndex = existingCartItems.findIndex((item: Product) => item.id === product.id);

                if (existingProductIndex > -1) {
                    existingCartItems[existingProductIndex].quantity =
                        (existingCartItems[existingProductIndex].quantity || 1) + 1;
                } else {
                    existingCartItems.push({ ...product, quantity: 1 });
                }

                localStorage.setItem('cartItems', JSON.stringify(existingCartItems));

                // Show success toast
                toast.success(`${product.name} added to cart`);
            }
        } catch (error) {
            console.error('Failed to add to cart', error);
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div
                className="
                    bg-white rounded-2xl shadow-lg overflow-hidden 
                    transition-all duration-300 
                    hover:shadow-xl hover:-translate-y-2
                    border border-sky-100
                "
            >
                <div className="relative h-56 bg-sky-50 flex items-center justify-center overflow-hidden">
                    {product.cover_image ? (
                        <img src={`https://api.tamkeen.center/${product?.cover_image}`}
                           
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    ) : (
                        <span className="text-sky-500 text-lg">No Image</span>
                    )}
                    <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
                        {product.rating && (
                            <div className="bg-amber-400 text-white px-3 py-1 rounded-full flex items-center shadow-md">
                                <Star className="w-4 h-4 mr-1" fill="white" />
                                {product.rating}
                            </div>
                        )}
                        <div className="bg-sky-500 text-white px-2 py-1 rounded-full text-xs shadow-md">
                            {product.orders_count} Sold
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-xl font-bold text-sky-900 mb-3 truncate">{product.name}</h3>
                    <p className="text-sm text-sky-700 mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="flex items-center">
                                <p className="text-sky-700 font-bold text-2xl mr-3">${product.discounted_price}</p>
                                {product.price !== product.discounted_price && (
                                    <span className="text-sky-500 line-through text-sm">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 space-x-2">
                                {product.size && (
                                    <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                                        Size: {product.size}
                                    </span>
                                )}
                                {product.color && (
                                    <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                                        Color: {product.color}
                                    </span>
                                )}
                            </div>
                        </div>
                        <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full
                                ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                        >
                            {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                        </span>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            className="w-full bg-sky-600 text-white py-3 rounded-lg flex items-center justify-center space-x-3
                                hover:bg-sky-700 transition duration-300
                                disabled:bg-sky-300 disabled:cursor-not-allowed
                                transform active:scale-95"
                            disabled={product.stock === 0}
                            onClick={addToCart}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            <span className="font-semibold">Add to Cart</span>
                        </button>

                        <button
                            className="flex items-center justify-center bg-gray-500 text-white p-3 rounded-lg
                                hover:bg-gray-600 transition duration-300
                                transform active:scale-95"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <Eye className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;