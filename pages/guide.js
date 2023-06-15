// import React from 'react'
// import Layout from '@/components/Layout';
// import PostCard from '@/components/PostCard';

// function PurchasedPosts() {
//     return (
//         <Layout>
//              <h1 className='flex justify-center text-6xl mb-6 text-gray-600 -my-3'>Your Purchases</h1>
//              <div className='gap-5 max-w-7xl mx-auto grid md:grid-cols-2'>
//                  <PostCard />
//                  <PostCard />
//              </div>
//         </Layout> 
//        )
// }

// export default PurchasedPosts

import React from 'react'
import Layout from '@/components/Layout';
import {UserContextProvider} from "../contexts/UserContext";

function PurchasedPosts() {
  return (
   <Layout>
    <UserContextProvider>
        <h1 className='flex justify-center text-6xl mb-6 text-gray-600 -my-3'>Community Guideline</h1>
    </UserContextProvider>
   </Layout> 
  )
}

export default PurchasedPosts