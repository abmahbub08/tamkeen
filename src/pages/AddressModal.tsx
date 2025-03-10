import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  // Initial state for form data
  const INITIAL_FORM_DATA = {
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    apartment: '',
  };

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      toast.error('Authentication token not found!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://api.tamkeen.center/api/add-address',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Address added successfully!');
        
        // Reset form data to initial state
        setFormData(INITIAL_FORM_DATA);
        
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while adding the address.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Toaster />
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl relative">
        <h2 className="text-2xl font-semibold text-sky-600 text-center mb-6">Add New Address</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            placeholder="Apartment"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <div className="flex justify-end items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sky-600 border border-sky-400 rounded hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isLoading ? 'bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
            <div className="loader border-t-4 border-sky-600 rounded-full w-8 h-8 animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressModal;