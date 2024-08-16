/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Head from 'next/head';
import Image from 'next/legacy/image';
import {useSupabaseClient} from '@supabase/auth-helpers-react';
import {LockClosedIcon} from '@heroicons/react/solid';
import resetPassword from './resetPassword';
import {createClient} from '@supabase/supabase-js';
import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/outline';
import useColorMode from '@/hooks/useColorMode';
import { darkMode } from '@/tailwind.config';

/**
 * Login Page
 * @return {JSX.Element} The rendered login page
 */
function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  // const [setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logo = '/dsonmarket_rectangle_logo.png';
  const logoDark = '/dsonmarket_rectangle_logo_inverse.png';
  const [colorMode, setColorMode] = useColorMode();
  const [isMounted, setIsMounted] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [successResetPassword, setSuccessResetPassword] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Signs in the user with an email and password.
   * @async
  */
  async function signInWithEmail() {
    if (!email.endsWith('@dickinson.edu')) {
      setErrorMessage('Invalid email domain');
      return;
    }
    setIsLoggingIn(true); // Start the login process
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage('There is a problem logging you in. Please contact nguyenat@dickinson.edu for more detail.');
      setIsLoggingIn(false); // Login process completed
      return;
    }
    setIsLoggedIn(true); // Update the state to indicate successful login
    setIsLoggingIn(false);
  }

  /**
   * Signs up the user with an email and password.
   * @async
  */
  async function signUpWithEmail() {
    if (!email.endsWith('@dickinson.edu')) {
      setErrorMessage('Must use dickinson email');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setErrorMessage('There is a problem signing you up. Please contact nguyenat@dickinson.edu for more detail.');
      setMessage('');
      return;
    }
    setMessage('Please wait 1-2 minutes to confirm your email! The email could be in your junk folder!');
    setShowOtpPopup(true);
    setErrorMessage('');
  }

  /**
 * Toggles between sign-up and sign-in modes.
 */
  function toggleFormMode() {
    setIsSignUp(!isSignUp);
  }

  /**
   * Handle the OTP input change.
   * @param {Event} e - event
   */
  function handleOtpInputChange(e) {
    setOtpInput(e.target.value);
  }

  /**
 * Toggles between sign-up and sign-in modes.
 */
  async function verifyOTP() {
    // Check if the entered OTP is valid (e.g., a 6-digit number)
    if (/^\d{6}$/.test(otpInput)) {
      // Handle successful OTP submission here.
      // You can send the OTP to the server for verification if needed.
      // Once verified, you can proceed with user registration.
      // For now, we'll just log the OTP and close the popup.
      console.log('Entered OTP:', otpInput);
      const {data, error} = await supabase.auth.verifyOtp({email, token: otpInput, type: 'email'});
      setShowOtpPopup(false);
    } else {
      setMessage('');
      setOtpError('Invalid OTP. Please enter a 6-digit number.');
    }
  }

  /**
   * Close the OTP input popup.
   */
  function closeOtpPopup() {
    setShowOtpPopup(false);
    setMessage('');
    setErrorMessage('');
    setOtpInput('');
    setOtpError('');
  }

  /**
   * Close the OTP input popup.
   */
  function openOtpPopup() {
    setShowOtpPopup(true);
    setMessage('');
    setOtpInput('');
    setOtpError('');
  }

  async function sendResetPassword() {
    if (!email.endsWith('@dickinson.edu')) {
      setErrorMessage('Must use dickinson email');
      return;
    }
    const {data, error} = await supabase.auth.resetPasswordForEmail(
      email,
    );
    if (error) {
      setErrorMessage('There is a problem verifying your email. Please contact nguyenat@dickinson.edu for more detail.');
      setMessage('');
      return;
    }
    setMessage('Please wait 5 minutes for reset password link! The email could be in your junk folder!');
    setErrorMessage('');
  }

  return (
    <div className="flex flex-col h-screen" style={{backgroundColor: '#F2F2F2', fontFamily: 'Roboto, sans-serif'}}>
      <Head>
        <title>Dson Market — Secure</title>
      </Head>
      <header className="sticky top-0 z-50 bg-white border-2 border-lightBorder dark:border-customBlack2 dark:bg-customBlack flex items-center p-2 lg:px-5 px-4 shadow-md">
        <div className="flex items-center">
          {colorMode == 'light' ? (
            <Image src={logo} height={75} width={1.80584551148*75} objectFit="fixed" />
          ) : (
            <Image src={logoDark} height={75} width={1.80584551148*75} objectFit="fixed" />
          )}
        </div>
        <button
          className="flex gap-2 items-center ml-auto p-2 rounded-full bg-transparent hover:scale-125 transition-all"
          onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
        >
          {isMounted && (
            colorMode === 'dark' ? (
              <SunIcon className="h-7 w-7 dark:text-white text-darkBG" />
            ) : (
              <MoonIcon className="h-7 w-7" />
            )
          )}
        </button>
      </header>
      <main className="flex-grow dark:bg-darkBG">
        <div className="flex items-center justify-center h-full">
          <div className="flex justify-center gap-20 w-full">
            <div className="flex flex-col items-center">
              <div className="border-3 dark:border-lightBG border-darkBG rounded-full h-20 w-20 flex items-center justify-center">
                {isLoggingIn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isMounted && colorMode === 'dark' ? '#F4F4F4' : '#17181C'}className="w-10 h-10">
                    <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
                  </svg>
                ) : (
                  <LockClosedIcon
                    className='w-10 h-10'
                    style={{
                      color: isMounted && colorMode === 'dark' ? '#F4F4F4' : '#17181C',
                    }}
                  />
                )}
              </div>
              <div className='mt-5 grow'>
                <div className='border-2 border-lightBorder dark:border-customBlack2 dark:bg-customBlack bg-white rounded-xl mb-5 w-full sm:w-auto'>
                  {isSignUp ? (
                    <h1 className="p-5 font-bold text-4xl text-center mt-3 -mb-5 dark:text-lightBG text-darkBG">
                      Sign Up
                    </h1>
                  ) : (
                    <h1 className="p-5 font-bold text-4xl text-center mt-3 -mb-5 dark:text-lightBG text-darkBG">
                      Sign In
                    </h1>
                  )}
                  <div className='rounded-md overflow-hidden text-darkBG'>
                    <div className="flex flex-col gap-4 p-4">
                      {message && <p className="text-green-500 flex justify-center">{message}</p>}
                      {errorMessage && <p className="text-red-500 flex justify-center">{errorMessage}</p>}
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded-md"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded-md"
                      />
                      {isSignUp && (
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="border p-2 rounded-md"
                        />
                      )}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFormMode();
                        }}
                        className="text-gray-500 dark:text-gray-300 cursor-pointer text-sm"
                      >
                        {isSignUp ? (
                          <span className=''>
                            Already have an account?{' '}
                            <span className="hover:underline hover:cursor-pointer font-semibold text-gray-900 dark:text-lightBG">
                              Sign In
                            </span>
                          </span>
                        ) : (
                          <span className=''>
                            Don&apos;t have an account yet?{' '}
                            <span className="hover:underline hover:cursor-pointer font-semibold text-gray-900 dark:text-lightBG">
                              Register now!
                            </span>
                          </span>
                        )}
                      </a>
                      {isSignUp ? (
                        <button onClick={signUpWithEmail} className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 border border-red-500 rounded">
                          Sign Up
                        </button>
                      ) : (
                        <button onClick={signInWithEmail} className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 border border-red-500 rounded">
                          Sign In
                        </button>
                      )}
                      {isSignUp && (
                        <button onClick={openOtpPopup} className="bg-red-400 text-white px-4 py-2 font-semibold rounded hover:bg-red-600">
                        Enter OTP
                        </button>
                      )}
                      <span className='sm:text-sm flex justify-center mt-1 dark:text-lightBG text-darkBG'>
                        — Remember to use Dickinson email! —
                      </span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFormMode();
                        }}
                        className="text-gray-800 cursor-pointer"
                      >
                        {isSignUp ? (
                          <span className='flex justify-center gap-1 dark:text-lightBG'>
                            Already have an account?
                            <span className="hover:underline hover:cursor-pointer font-semibold dark:text-lightBG">
                              Sign In
                            </span>
                          </span>
                        ) : (
                          <span className='flex justify-center gap-1 dark:text-lightBG'>
                            Don&apos;t have an account?{' '}
                            <span className="hover:underline hover:cursor-pointer font-semibold dark:text-lightBG ">
                              Register now
                            </span>
                          </span>
                        )}
                      </a>
                      <p className='hover: cursor-pointer font-semibold underline flex justify-center gap-1 -mt-2 dark:text-lightBG' onClick={() => setResetPassword(!resetPassword)}>Forgot password?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Reset Password Popup */}
      {resetPassword && ( 
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {message && <p className="text-green-500 flex justify-center mb-2">{message}</p>}
          <h2 className="text-xl mb-4">Enter your email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name='email'
            className="w-full border p-2 mb-2 rounded-md"
            placeholder="Enter your email"
          />
          {successResetPassword && <div className='text-green-600 mt-1 mb-2'>Success! Check your email to reset your password.</div>}
          <button onClick={sendResetPassword} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Submit
          </button>
          <button onClick={() => {
            setResetPassword(false);
            setMessage('');
            setErrorMessage('');
          }} className="bg-gray-300 text-gray-700 ml-2 px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
      )}
      {/* OTP Input Popup */}
      {showOtpPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {message && <p className="text-green-500 flex justify-center mb-2">{message}</p>}
            <h2 className="text-xl mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otpInput}
              onChange={handleOtpInputChange}
              className="w-full border p-2 mb-2 rounded-md"
              placeholder="Enter OTP"
            />
            {otpError && <p className="text-red-500 mb-2">{otpError}</p>}
            <button onClick={verifyOTP} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Submit
            </button>
            <button onClick={closeOtpPopup} className="bg-gray-300 text-gray-700 ml-2 px-4 py-2 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
