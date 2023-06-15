import Card from '@/components/Card';
import Layout from '@/components/Layout';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import Image from "next/legacy/image";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function LoginPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
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
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });
        if (error) {
            setErrorMessage('Invalid email or password');
            return;
        }
    }

  async function signUpWithEmail() {
    if (!email.endsWith('@dickinson.edu')) {
      setErrorMessage('Invalid email domain');
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
    <div className="flex flex-col items-center h-screen" style={{ backgroundColor: '#F0F2F5' }}>
      <Head>
        <title>Dson Market - log in or sign up</title>
      </Head>
      <Image
        src={logo}
        height={400}
        width={400}
        objectFit="contain"
      />
      <h1 className="p-5 text-red-500 font-semibold text-6xl text-center -mt-6">
        Dson Market
      </h1>
      <div className='mt-5 grow'>
        <Card noPadding={true}>
          <div className='rounded-md overflow-hidden'>
            <button onClick={loginWithGoogle} className='flex w-full gap-4 items-center justify-start p-4 border-b border-b-gray-200 hover:bg-red-500 hover:text-white hover:border-b-text-red-500 transition-all'>
              <svg className='h-8 fill-current' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
              Login with Google
            </button>
            <div className="flex flex-col gap-4 p-4">
                {message && <p className="text-green-500">{message}</p>}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
              {isSignUp ? (
                <button onClick={signUpWithEmail} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 border border-red-500 rounded">
                  Sign Up
                </button>
              ) : (
                <button onClick={signInWithEmail} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 border border-red-500 rounded">
                  Sign In
                </button>
              )}
              <button onClick={toggleFormMode} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
                {isSignUp ? 'Sign In Instead' : 'Create an Account'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
