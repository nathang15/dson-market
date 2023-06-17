import Card from '@/components/Card';
import Layout from '@/components/Layout';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from "next/legacy/image";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { LockClosedIcon } from '@heroicons/react/solid';
import Link from 'next/link';

function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logo = "/1280px-Dickinson_Red_Devils_D_logo.svg.png";

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  async function signInWithEmail() {
    if (!email.endsWith('@dickinson.edu')) {
      setErrorMessage('Invalid email domain');
      return;
    }
    setIsLoggingIn(true); // Start the login process
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage('Invalid email or password');
      setIsLoggingIn(false); // Login process completed
      return;
    }
    setIsLoggedIn(true); // Update the state to indicate successful login
    setIsLoggingIn(false);
  }

  async function signUpWithEmail() {
    if (!email.endsWith('@dickinson.edu')) {
      setErrorMessage('Must use dickinson email');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setErrorMessage('Sign up failed');
      setMessage('');
      return;
    }
    setMessage('Please check your email for a confirmation link');
    setErrorMessage('');
  }

  function toggleFormMode() {
    setIsSignUp(!isSignUp);
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#F2F2F2', fontFamily: 'Roboto, sans-serif' }}>
      <Head>
        <title>Dson Market — Secure</title>
      </Head>
      <header className="sticky top-0 z-50 bg-white flex items-center p-2 lg:px-5 px-4 shadow-md">
          <div className="px-4 flex items-center">
            <Image src={logo} height={40} width={48} objectFit="fixed" />
            <h1 className="text-xl font-bold ml-2">DSON MARKET</h1>
          </div>
          <button className="flex gap-2  items-center ml-auto bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 border border-red-500 rounded">
            Request Demo
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
          </button>
      </header>
      <main className="flex-grow">
        <div className="flex items-center justify-center h-full">
          <div className="flex justify-center gap-20 w-full">
            <div className="flex flex-col items-center">
              <div className="border-3 border-customGray rounded-full h-20 w-20 flex items-center justify-center">
                {isLoggingIn ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#A2A2A2" className="w-10 h-10">
                    <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
                  </svg>
                ) : (
                  <LockClosedIcon
                    className='w-10 h-10'
                    style={{
                      color: '#A2A2A2',
                    }}
                  />
                )}
              </div>
              <div className='mt-5 grow'>
                <div className='bg-white rounded-xl mb-5' style={{ width: '400px' }}>
                  {isSignUp ? (
                    <h1 className="p-5 font-bold text-4xl text-center mt-3 -mb-5">
                      Sign Up
                    </h1>
                  ) : (
                    <h1 className="p-5 font-bold text-4xl text-center mt-3 -mb-5">
                      Sign In
                    </h1>
                  )}
                  <div className='rounded-md overflow-hidden'>
                    <div className="flex flex-col gap-4 p-4">
                      {message && <p className="text-green-500 flex justify-center">{message}</p>}
                      {errorMessage && <p className="text-red-500 flex justify-center">{errorMessage}</p>}
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2"
                      />
                      {isSignUp && (
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="border p-2"
                        />
                      )}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFormMode();
                        }}
                        className="text-gray-500 cursor-pointer mb-5 text-sm"
                      >
                        {isSignUp ? (
                          <span className=''>
                            Already have an account?{' '}
                            <span className="hover:underline hover:cursor-pointer font-semibold text-gray-900">
                              Sign In
                            </span>
                          </span>
                        ) : (
                          <span className=''>
                            Don&apos;t have an account yet?{' '}
                            <span className="hover:underline hover:cursor-pointer font-semibold text-gray-900">
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
                      <span className='flex justify-center mt-1'>
                        — Remember to use Dickinson email! —
                      </span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFormMode();
                        }}
                        className="text-gray-800 cursor-pointer mb-4"
                      >
                        {isSignUp ? (
                          <span className='flex justify-center gap-1'>
                            Already have an account?
                            <span className="hover:underline hover:cursor-pointer font-semibold">
                              Sign In
                            </span>
                          </span>
                        ) : (
                          <span className='flex justify-center gap-1'>
                            Don&apos;t have an account?{' '}
                            <span className="hover:underline hover:cursor-pointer font-semibold">
                              Register now
                            </span>
                          </span>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="mt-16 hidden sm:block">
              <Image
                src={logo}
                height={400}
                width={400}
                objectFit="contain"
              />
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
