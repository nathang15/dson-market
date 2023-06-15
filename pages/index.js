import Card from "../components/Card";
import Head from "next/head";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostFormCard from "@/components/PostFormCard";
import Feed from "@/components/Feed";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {useEffect, useState} from "react";
import LoginPage from "./login";

export default function Home() {
  const supabase = useSupabaseClient();
  const session = useSession();
  // const [posts,setPosts] = useState([]);
  // const [profile,setProfile] = useState(null);

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  // useEffect(() => {
  //   if (!session?.user?.id) {
  //     return;
  //   }
  //   supabase.from('profiles')
  //     .select()
  //     .eq('id', session.user.id)
  //     .then(result => {
  //       if (result.data.length) {
  //         setProfile(result.data[0]);
  //       }
  //     })
  // }, [session?.user?.id]);

  // function fetchPosts() {
  //   supabase.from('posts')
  //     .select('id, content, created_at, photos, profiles(id, avatar, name)')
  //     .eq('parent', 8)
  //     .order('created_at', {ascending: false})
  //     .then(result => {
  //       console.log('posts', result);
  //       setPosts(result.data);
  //     })
  // }

  if (!session) {
    return <LoginPage />
  }

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Dson Market V2</title>
      </Head>

      <Header />
      
      <main className="flex">
        <Sidebar />
        <Feed/>
      </main>
      
    </div>
  );
}
