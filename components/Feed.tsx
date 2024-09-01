import React, { useEffect, useState, useCallback } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { UserContext } from '@/contexts/UserContext';
import { MenuAlt2Icon } from '@heroicons/react/solid';
import PostFormCard from './PostFormCard';
import PostCard from './PostCard';
import { useInView } from 'react-intersection-observer';

const POSTS_PER_PAGE = 5;

function Feed() {
  const session = useSession();
  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState({});
  const [sortBy, setSortBy] = useState('desc');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0,
  });

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, content, created_at, photos, sold, profiles(id, avatar, name)')
      .is('sold', false)
      .is('parent', null)
      .order('created_at', { ascending: sortBy === 'asc' })
      .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    if (data.length < POSTS_PER_PAGE) {
      setHasMore(false);
    }

    setPosts((prevPosts) => [...prevPosts, ...data]);
    setPage((prevPage) => prevPage + 1);
  }, [supabase, sortBy, page]);

  useEffect(() => {
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        setPosts([]);
        setPage(0);
        setHasMore(true);
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase, fetchPosts]);

  useEffect(() => {
    if (inView && hasMore) {
      fetchPosts();
    }
  }, [inView, hasMore, fetchPosts]);

  useEffect(() => {
    if (!session?.user?.id) return;

    supabase
      .from('profiles')
      .select()
      .eq('id', session.user.id)
      .then((result) => {
        if (result.data.length) {
          setProfile(result.data[0]);
        }
      });
  }, [session?.user?.id, supabase]);

  const toggleSortOrder = () => {
    setSortBy((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'));
    setPosts([]);
    setPage(0);
    setHasMore(true);
  };

  return (
    <div className="flex-grow h-screen pb-44 md:pt-6 pt-0 overflow-auto">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        <UserContext.Provider value={{ profile }}>
          <div>
            <PostFormCard onPost={fetchPosts} />
            <button
              onClick={toggleSortOrder}
              className="bg-red-500 hover:scale-105 text-white px-2 py-2 rounded-md mb-3 -mt-2 dark:bg-customBlack dark:border-customBlack2 dark:border-2 transition-all"
            >
              <div className="flex items-center justify-start">
                <MenuAlt2Icon className="h-6 text-lightBG group-hover:text-white transition duration-300 ease-in-out transform" />
                {sortBy === 'asc' ? 'Ascending' : 'Descending'}
              </div>
            </button>
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} {...post} />)
            ) : (
              <p className="dark:text-lightBG text-darkBG text-center md:text-2xl text-lg font-bold">
                Be the first one to post!
              </p>
            )}
            {hasMore && (
              <div ref={ref} className="h-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500"></div>
              </div>
            )}
          </div>
        </UserContext.Provider>
      </div>
    </div>
  );
}

export default Feed;