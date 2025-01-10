import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // List of allowed email addresses
  const allowedEmails = ['agungtrivaldo@gmail.com','nazhiv.ash@gmail.com'];

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user's email is in the allowed list
      if (allowedEmails.includes(user.email)) {
        console.log('Login successful!');
        // Navigate to the dashboard
        navigate('/dashboard');
      } else {
        console.error('Unauthorized access:', user.email);
        alert('You are not authorized to access this application.');
        // Sign out unauthorized user
        await auth.signOut();
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="mb-4 text-gray-600">Please log in to access your dashboard.</p>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
