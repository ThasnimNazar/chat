import React, { useState } from 'react';
import './index.css';
import '../src/Css/App.css';
import MenuAppBar from './Components/Header';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios'
import Loader from './Components/Loader';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { publicApi } from './Axiosconfig';


interface FormErrors {
  [key: string]: string;
}

const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneno, setPhoneno] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate()

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const submitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    } else if (name.length > 20) {
      errors.name = 'Name should be less than 20 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }

    if (!phoneno) {
      errors.phoneno = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneno)) {
      errors.phoneno = 'Phone number must be 10 digits';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setSnackbarMessage(Object.values(errors).join(' '));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else {
      setLoading(true);
      try {
        const response = await publicApi.post('/api/user', {
          name: name,
          email: email,
          phoneno: phoneno,
          password: password,
          confirmPassword: confirmPassword,
        });
        console.log(response, 'res')
        const role = response.data.user.role
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('role', role)
        console.log(response);
        setSnackbarMessage('Registration successful!');
        setIsAuthenticated(true);

        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setName('');
        setEmail('');
        setPhoneno('');
        setPassword('');
        setConfirmPassword('');
      } catch (error: unknown) {
        setSnackbarMessage(error instanceof Error ? error.message : 'Registration failed!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const userInfo = localStorage.getItem('userInfo')

  const chatHandler = () =>{
    navigate('/user/chat')
  }

  const loginHandler = async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    const errors: FormErrors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    else{
      try{
        const response = await publicApi.post('/api/user/login',{
          email:email,
          password:password
        })
        console.log(response)
        const role =  response.data.user.role
        localStorage.setItem('role',role)
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        setEmail('');
        setPassword('');
      }
      catch (error: unknown) {
        setSnackbarMessage(error instanceof Error ? error.message : 'Registration failed!');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error(error);
      }
    }
    
  }

  return (
    <>
      <MenuAppBar />
      <div className="flex h-screen">
        <div className="w-1/2 flex items-center justify-center bg-gray-100 p-8">
          <div className="w-full max-w-md">
            {!userInfo ? (
              <>
                <div className="text-center mb-4">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? 'Already have an account? Login' : 'Not registered? Register'}
                  </button>
                </div>

                {isRegistering ? (
                  <form onSubmit={submitRegister}>
                    <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneno">
                        Phone Number
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="text"
                        id="phoneno"
                        value={phoneno}
                        onChange={(e) => setPhoneno(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                      />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600">
                      {loading ? <Loader /> : 'Sign Up'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={loginHandler}>
                    <h2 className="text-2xl font-bold mb-6">Login</h2>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                      </label>
                      <input
                        className="w-full p-3 border border-gray-300 rounded-md"
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                      />
                    </div>
                    <button className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600">
                      Login
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-blue-500 xl:text-4xl lg:text-2xl font-serif"><span className="block w-full">Chat, share, connect-</span>anytime, anywhere!</h1>
                <p className="py-4 text-lg text-black 2xl:py-8 md:py-6 2xl:pr-5 font-serif">
                More than messages, it's meaningful connections....
                </p>
                <Button variant="contained" onClick={chatHandler}>Connect</Button>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2">
          <img
            src="https://www.wpdownloadmanager.com/wp-content/uploads/2021/06/101-Most-Popular-Live-Chat-Scripts-and-Customer-Service-Phrases-to-Use.png"
            alt="Decorative"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
export default App;
