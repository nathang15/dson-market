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

  if (!session) {
    return <LoginPage />
  }

  return (
    <div className="h-screen bg-lightBG dark:bg-darkBG overflow-hidden">
      <Head>
        <title>Dson Market</title>
      </Head>

      <Header />
      
      <main className="flex">
        <div className="bg-white border-2 border-lightBorder dark:bg-customBlack dark:border-customBlack2 -mt-1">
        <Sidebar />
        </div>
        <Feed/>
      </main>
      
    </div>
  );
}
