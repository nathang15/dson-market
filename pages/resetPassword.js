import React, { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  SunIcon,
  MoonIcon,
} from '@heroicons/react/outline';
import useColorMode from '@/hooks/useColorMode';
import Head from 'next/head';
import Image from 'next/legacy/image';

function resetPassword() {
  const supabase = useSupabaseClient();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const logo = '/dsonmarket_rectangle_logo.png';
  const logoDark = '/dsonmarket_rectangle_logo_inverse.png';
  const [colorMode, setColorMode] = useColorMode();
  const [isMounted, setIsMounted] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setShowForm(true);
      }
    });
  }, [supabase]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (data) {
      setSuccess(true);
    } 
    if (error) {
      setError(true);
    }
  };

    /**
   * Handle the OTP input change.
   * @param {Event} e - event
   */
    function handleOtpInputChange(e) {
      setOtpInput(e.target.value);
    }

    /**
   * Handle the email input change.
   * @param {Event} e - event
   */
        function handleEmail(e) {
          setEmail(e.target.value);
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
        if (data) {
          setOtpVerified(true);
        }
      } else {
        setMessage('');
        setOtpError('Invalid OTP. Please try again.');
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

  return (
    <div className="flex flex-col h-screen" style={{backgroundColor: '#F2F2F2', fontFamily: 'Roboto, sans-serif'}}>
      <Head>
        <title>Dson Market — Reset Password</title>
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
              {showForm ? (
                <div className='mt-5 grow'>
                  <div className='border-2 border-lightBorder dark:border-customBlack2 dark:bg-customBlack bg-white rounded-xl mb-5 w-full sm:w-auto'>
                    <h1 className="p-5 font-bold text-4xl text-center mt-3 -mb-5 dark:text-lightBG text-darkBG">
                      Reset Password
                    </h1>
                    {error && <p className="text-red-500 flex justify-center mb-2 mt-2 font-semibold">Please check your input. Otherwise, contact nguyenat@dickinson.edu for more details.</p>}
                    {otpVerified === false && errorMessage && <p className="text-red-500 flex justify-center mb-2 mt-2 font-semibold">{errorMessage}</p>}
                    {!success ? (
                      <div className='rounded-md overflow-hidden text-darkBG'>
                        <div className="flex flex-col gap-4 p-4">
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='New Password'
                            className="border p-2 rounded-md"
                            required
                          />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm Password'
                            className="border p-2 rounded-md"
                            required
                          />
                          <button className="w-full bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 border border-red-500 rounded" onClick={handlePasswordUpdate} >Update Password </button>
                          <button onClick={openOtpPopup} className="bg-red-400 text-white px-4 py-2 font-semibold rounded hover:bg-red-600">
                          Enter OTP
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-green-500 flex justify-center font-semibold p-2">Password updated successfully! You can now close this page.</p>
                    )}
                  </div>
                </div>
                ) : (
                  <p>404</p>
                )}
            </div>
          </div>
        </div>
      </main>
      {/* OTP Input Popup */}
      {showOtpPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {message && <p className="text-green-500 flex justify-center mb-2">{message}</p>}
            <h2 className="text-xl mb-4">OTP Verification</h2>
            <input
              type="email"
              value={email}
              onChange={handleEmail}
              className="w-full border p-2 mb-2 rounded-md"
              placeholder="Your Email"
            />
            <input
              type="text"
              value={otpInput}
              onChange={handleOtpInputChange}
              className="w-full border p-2 mb-2 rounded-md"
              placeholder="6-digit OTP"
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

export default resetPassword;
