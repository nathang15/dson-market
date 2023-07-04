import React from 'react'
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import {useEffect, useState} from "react";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {UserContextProvider} from "../contexts/UserContext";

function SavedPostsPage() {
  const [posts, setPosts] = useState([]);
  const session = useSession();
  const supabase = useSupabaseClient();
  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', session.user.id)
      .then(result => {
        const postsIds = result.data.map(item => item.post_id);
        supabase
          .from('posts')
          .select('*, profiles(*)').in('id', postsIds)
          .order('created_at', {ascending: true})
          .then(result => setPosts(result.data));
      });
  }, [session?.user?.id]);
  return (
   <Layout>
    <UserContextProvider>
      <h1 className='flex justify-center text-6xl mb-6 text-darkBG dark:text-lightBG underline decoration-red-500 -my-3 font-bold decoration-8'>Saved Listings</h1>
          {posts.length > 0 && posts.map(post => (
            <div key={post.id}>
              <PostCard {...post} />
            </div>
          ))}
    </UserContextProvider>
   </Layout> 
  )
}

export default SavedPostsPage