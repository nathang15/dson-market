import React from 'react';
import PostFormCard from './PostFormCard';
import PostCard from './PostCard';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {useEffect, useState} from 'react';
import {UserContext} from '@/contexts/UserContext';
import {
  MenuAlt2Icon,
} from '@heroicons/react/solid';

/**
 * A React component for displaying the feed.
 * @return {JSX.Element} - The rendered React element.
 */
function Feed() {
  // Fetch the user's session
  const session = useSession();
  // Initialize state variables for posts and the Supabase client
  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient();
  // Initialize state variable for the user's profile
  const [profile, setProfile] = useState({});
  const [sortBy, setSortBy] = useState('desc');

  // Subscribe to changes in the 'posts' channel when the component mounts, enables real-time posts
  useEffect(() => {
    const subscription = supabase
        .channel('posts')
        .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
            },
            (payload) => fetchPosts(),
        )
        .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  // Fetch posts and user profile when the session or user ID changes
  useEffect(() => {
    fetchPosts();
    if (!session?.user?.id) {
      return;
    }
    supabase.from('profiles')
        .select()
        .eq('id', session.user.id)
        .then((result) => {
          if (result.data.length) {
            setProfile(result.data[0]);
          }
        });
  }, [session?.user?.id]);

  /**
   * Fetches the posts from the Supabase database.
   */
  function fetchPosts() {
    supabase
        .from('posts')
        .select('id, content, created_at, photos, sold, profiles(id, avatar, name)')
        .is('sold', false)
        .is('parent', null)
        .order('created_at', {ascending: sortBy === 'asc'})
        .then((result) => {
          setPosts(result.data);
        });
  }

  const toggleSortOrder = () => {
    // Toggle the sorting order when the button is clicked
    setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex-grow h-screen pb-44 md:pt-6 pt-0 overflow-auto">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        <UserContext.Provider value={{profile}}>
          <div>
            <PostFormCard onPost={fetchPosts}/>
            <button
              onClick={toggleSortOrder}
              className='bg-red-500 hover:scale-105 text-white px-2 py-2 rounded-md mb-3 -mt-2 dark:bg-customBlack dark:border-customBlack2 dark:border-2 transition-all'
            >
              <div className='flex items-center justify-start'>
                <MenuAlt2Icon className="h-6 text-lightBG group-hover:text-white transition duration-300 ease-in-out transform" />
                {sortBy === 'asc' ? 'Ascending' : 'Descending'}
              </div>
            </button>
            {posts?.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} {...post} />)
          ) : (
            <p className="dark:text-lightBG text-darkBG text-center md:text-2xl text-lg font-bold">Be the first one to post!</p>
          )}
          </div>
        </UserContext.Provider>
      </div>
    </div>
  );
}

export default Feed;
