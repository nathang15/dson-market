import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import {UserContext} from '@/contexts/UserContext';
import PreLoader from '@/components/PreLoader';
import Avatar from '@/components/Avatar';
import Link from 'next/link';
import Card from '@/components/Card';
import {ChatAltIcon} from '@heroicons/react/outline';

const UserCard = ({id, name, avatar}) => (
  <Card isUserCard>
    <div key={id} className="user-card flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <Link href={`/profile/${id}`}>
          <span className='cursor-pointer'>
            <Avatar url={avatar} />
          </span>
        </Link>
        <Link href={`/profile/${id}`}>
          <p className="name dark:text-lightBG md:text-lg text-md">{name}</p>
        </Link>
      </div>
      <Link href={`/profile/${id}/chat`}>
        <div className='flex gap-1 items-center'>
          <ChatAltIcon className="h-7 w-7 bg-transparent text-red-500" />
          <span className="md:block dark:text-lightBG md:text-lg text-md">Chat</span>
        </div>
      </Link>
    </div>
  </Card>
);

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
    supabase
        .from('profiles')
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
      const {data: posts, error: postsError} = await supabase
          .from('posts')
          .select('id, content, created_at, photos, profiles(id, avatar, name)')
          .is('parent', null)
          .eq('sold', false)
          .order('created_at', {ascending: false});

      if (postsError) {
        console.error('Error fetching search results:', postsError);
      } else {
        const queryWords = query.toLowerCase().split(' ');
        const filteredPosts = posts.filter((post) =>
          queryWords.every((word) => post.content.toLowerCase().includes(word)),
        );

        const {data: profiles, error: profilesError} = await supabase
            .from('profiles')
            .select('id, avatar, name')
            .ilike('name', `%${query}%`);

        if (profilesError) {
          console.error('Error fetching profile search results:', profilesError);
        } else {
          const profileResults = profiles.map((profile) => ({
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar,
          }));

          const combinedResults = [...profileResults, ...filteredPosts].sort((a, b) => {
            if ('name' in a) return -1;
            return 1;
          });

          setSearchResults(combinedResults || []);
        }
      }
    } catch (error) {
      console.error('Error searching posts or profiles:', error);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <UserContext.Provider value={{profile}}>
        <h1 className="flex justify-center md:text-5xl text-xl font-semibold mb-6 text-gray-600 -my-3">
          Search Results for &quot;{query}&quot;
        </h1>
        {loading ? (
          <div className="flex justify-center mt-5">
            <PreLoader />
          </div>
        ) : searchResults.length === 0 ? (
          <p className="flex justify-center text-2xl mb-6 text-gray-600 -my-3 mt-5 font-bold">
            No results found
          </p>
        ) : (
          searchResults.map((result) =>
            'name' in result ? (
              <div key={result.id} className="">
                <UserCard {...result} />
              </div>
            ) : (
              <PostCard key={result.id} {...result} />
            ),
          )
        )}
      </UserContext.Provider>
    </Layout>
  );
}

export default SearchPage;
