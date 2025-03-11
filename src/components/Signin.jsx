import React, { useState } from 'react';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './Firebase.js';
import { doc, getDoc } from 'firebase/firestore'; 
import { firestore } from './Firebase.js'; 
import { useNavigate, Link } from 'react-router-dom';
import something from '../assets/bg.png';
import picture from '../assets/icon.svg';
  export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 
 try {
      const userObj = await signInWithEmailAndPassword(auth, email, password);
      const userdata = userObj.user;


      const userDoc = doc(firestore, 'Users', userdata.uid); 
      const userSnap = await getDoc(userDoc);
  console.log('User role:', userSnap.data().role);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        updateProfile(userdata, { displayName: 'Admin' });
        navigate('/'); 
      } else {
        setError('Access denied. Only Admins can log in.');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };
return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${something})`,
      }}
    >
      <div className="flex justify-center gap-y-6 w-full">
        <div className="w-full max-w-xl flex flex-col space-y-8 p-10 bg-[#130E26] rounded-xl shadow-lg">
          <img
            src={picture}
            alt="Logo"
            className="w-32 h-auto mx-auto object-cover"
          />
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-white">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-gray-700"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-gray-300 focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm bg-gray-700"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgetpassword" className="font-medium text-white hover:text-gray-300">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#BD23FF] hover:bg-[#9033DA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                Sign in
              </button>
            </div>
          </form>
          {error && <p className="mt-2 text-center text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
