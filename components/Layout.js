import React from 'react'
import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
function Layout({children}) {
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Dson Market V2</title>
      </Head>

      <Header />
      
      <main className="flex">
        <Sidebar />
        <div className="flex-grow h-screen pb-44 pt-6 mr-4 xl:mr-40 overflow-y-auto scrollbar-hide">
            {children}
        </div>
      </main>
      
    </div>
  )
}

export default Layout