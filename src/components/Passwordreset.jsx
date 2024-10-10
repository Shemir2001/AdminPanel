import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { app } from './Firebase.js';
import { auth } from './Firebase.js';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      message.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      message.success('Password reset link sent to your email');
      setLoading(false);
      setTimeout(() => {
        navigate('/login'); 
      }, 4000);
    } catch (error) {
      setLoading(false);
      message.error(error.message || 'Failed to send password reset email');
    }
  };
return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-teal-700 px-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Reset Password</h2>
        <p className="text-center text-gray-600 mb-8">Enter your email to reset your password</p>
         <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            className={`w-full mt-6 py-2 px-4 rounded-lg bg-teal-500 text-white font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Sending reset link...' : 'Send Password Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <button onClick={() => navigate('/login')} className="text-indigo-500 hover:underline">
              Login
            </button>
          </p>
        </div>


        
      </div>
    </div>
  );
};
export default PasswordReset;
