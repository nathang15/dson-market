import '@/styles/globals.css';
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs';
import {SessionContextProvider} from '@supabase/auth-helpers-react';
import React, {useState} from 'react';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);

/**
 * Main application component.
 *
 * @param {Object} props - The component's properties.
 * @param {React.Component} props.Component - The main component to render.
 * @param {Object} props.pageProps - Additional props to pass to the main component.
 * @return {React.Component} - The rendered application.
 */
export default function App({Component, pageProps}) {
  // Initialize the Supabase client for browser usage.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    // Provide the Supabase client and initial session to the SessionContextProvider.
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  );
  // return <Component {...pageProps} />
}
