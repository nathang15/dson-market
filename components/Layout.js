import React from 'react'
import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
function Layout({children}) {
  return (
    <div className="h-screen bg-lightBG dark:bg-darkBG overflow-hidden">
      <Head>
        <title>DSON MARKET</title>
      </Head>

      <Header />
      
      <main className="flex">
        <div className="bg-white border-2 border-lightBorder dark:bg-customBlack dark:border-customBlack2 -mt-1">
          <Sidebar />
        </div>
        <div className="flex-grow h-screen pb-24 pt-6 mr-4 xl:mr-40 overflow-y-auto scrollbar-hide dark:bg-darkBG">
            {children}
        </div>
      </main>
      
    </div>
  )
}

export default Layout