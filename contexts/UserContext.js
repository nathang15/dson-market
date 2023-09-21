import React, {createContext, useEffect, useState} from 'react';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';

/**
 * Context for managing user profiles within the application.
 * @typedef {Object} UserContext
 * @property {Object} profile - User profile data.
 */

/**
 * React context for managing user profiles within the application.
 * @type {import('react').Context<UserContext>}
 */
export const UserContext = createContext({});

/**
 * Provider component for the UserContext, responsible for fetching and providing user profile data.
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the UserContextProvider.
 * @return {JSX.Element} - JSX element containing the provided context and child components.
 */
export function UserContextProvider({children}) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase.from('profiles')
        .select()
        .eq('id', session.user.id)
        .then((result) => {
          setProfile(result.data?.[0]);
        });
  }, [session?.user?.id]);
  return (
    <UserContext.Provider value={{profile}}>
      {children}
    </UserContext.Provider>
  );
}
