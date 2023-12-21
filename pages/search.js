import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContext} from '@/contexts/UserContext';
import PreLoader from '@/components/PreLoader';

/**
 * Search Results page
 * @return {JSX.Element} The rendered Search Results page
 */
function SearchPage() {
  const session = useSession();
  const router = useRouter();
  const {query} = router.query;
  const supabase = useSupabaseClient();
  const [searchResults, setSearchResults] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchPosts();
    }
  }, [query]);

  useEffect(() => {
    searchPosts();
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
 * Searches for posts based on a query and updates the search results.
 * @async
 * @function searchPosts
 */
  async function searchPosts() {
    setLoading(true);
    try {
      const {data: posts, error} = await supabase
          .from('posts')
          .select('id, content, created_at, photos, profiles(id, avatar, name)')
          .is('parent', null)
          .order('created_at', {ascending: false});

      if (error) {
        console.error('Error fetching search results:', error);
      } else {
      // Split the query into individual words
        const queryWords = query.toLowerCase().split(' ');

        // Filter the posts based on the query containing all matching words
        const filteredPosts = posts.filter((post) =>
          queryWords.every((word) => post.content.toLowerCase().includes(word)),
        );

        setSearchResults(filteredPosts || []);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <UserContext.Provider value={{profile}}>
        <h1 className="flex justify-center md:text-5xl text-xl font-semibold mb-6 text-gray-600 -my-3">Search Results for &quot;{query}&quot;</h1>
        {loading ? (
                    <div className='flex justify-center mt-5'>
                      <PreLoader />
                    </div>
                    ) : searchResults.length === 0 ? (
                    <p className='flex justify-center text-2xl mb-6 text-gray-600 -my-3 mt-5 font-bold'>
                        No results found
                    </p>
                    ) : (
                    searchResults.map((post) => <PostCard key={post.id} {...post} />)
                )}
      </UserContext.Provider>
    </Layout>
  );
}

export default SearchPage;
