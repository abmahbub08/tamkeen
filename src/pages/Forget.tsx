import React, { useState } from 'react';
import axios from 'axios';
import { Mail, AlertTriangle, KeyRound, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Base URL for the API
const BASE_URL = 'https://api.tamkeen.center/api';

// Utility function to get cookie by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const ForgetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the token from cookies
      const token = getCookie('token');

      // Send forgot password request
      const response = await axios.post(
        `${BASE_URL}/password/forgot`, 
        { email },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle successful code send
      navigate('/password-reset', { 
        state: { email } // Pass email to next screen
      });
    } catch (err: any) {
      // Handle error response
      setError(
        err.response?.data?.message || 
        'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a verification code
          </p>
        </div>

        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertTriangle className="mr-2" size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

const NewPassword: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!verificationCode) {
      setError('Please enter verification code');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get email from previous screen
      const email = location.state?.email;
      
      if (!email) {
        throw new Error('No email provided');
      }

      // Get the token from cookies
      const token = getCookie('token');

      // Send password reset request
      const response = await axios.post(
        `${BASE_URL}/password/reset`,
        {
          email,
          otp: parseInt(verificationCode),
          password: newPassword,
          password_confirmation: confirmPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle successful password reset
      alert('Password reset successful!');
      navigate('/login'); // Redirect to login page
    } catch (err: any) {
      // Handle error response
      setError(
        err.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 mt-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your verification code and new password
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <KeyRound 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input 
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input 
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
            <input 
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertTriangle className="mr-2" size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export { ForgetPassword, NewPassword };