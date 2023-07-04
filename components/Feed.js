import React from "react";
import PostFormCard from "./PostFormCard";
import PostCard from "./PostCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";

function Feed() {
  const session = useSession();
  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const subscription = supabase
    .channel('posts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
      },
      (payload) => fetchPosts()
    )
    .subscribe()
  }, []);

  useEffect(() => {
    fetchPosts()
  }, []);
  
  useEffect(() => {
    fetchPosts();
    if(!session?.user?.id) {
      return;
    }
    supabase.from('profiles')
      .select()
      .eq('id', session.user.id)
      .then(result => {
        if (result.data.length) {
          setProfile(result.data[0]);
        }
      });
  }, [session?.user?.id]);
  
  function fetchPosts() {
    supabase.from('posts').select('id, content, created_at, photos, profiles(id, avatar, name)').is('parent', null).order('created_at', {ascending: false}).then(result => {
      setPosts(result.data);
    })
  }
  return (
    <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto scrollbar-hide">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        <UserContext.Provider value={{profile}}>
          <PostFormCard onPost={fetchPosts}/>
          {posts?.length > 0 && posts.map(post => (
            <PostCard key={post.id}{...post} />
          ))}
        </UserContext.Provider>  
      </div>
    </div>
  );
}

export default Feed;