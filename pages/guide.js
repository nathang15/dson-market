import React from 'react';
import Layout from '@/components/Layout';
import { UserContextProvider } from '../contexts/UserContext';

function PurchasedPosts() {
  return (
    <Layout>
      <UserContextProvider>
        <h1 className='flex justify-center md:text-5xl text-2xl mb-6 text-darkBG dark:text-lightBG underline decoration-red-500 -my-3 font-bold'>Community Guidelines</h1>
        
        <div className='flex justify-center'>
          <ul className='text-lg text-darkBG dark:text-lightBG md:w-2/3 w-5/6 leading-loose'>
            <li>
              <p className='font-semibold underline decoration-red-500 decoration-4'>1. Respect and Courtesy:</p> Treat all members of the community with respect and courtesy. Be mindful of your language and interactions. Avoid engaging in personal attacks, harassment, or discrimination based on race, gender, religion, nationality, sexual orientation, or any other personal characteristics.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>2. Post Tagging:</p> Every post should include either the #wantobuy (#wtb) or #wanttosell (#wts) tag to indicate the purpose of your post. This helps others quickly identify your intentions.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>3. Photo Requirement for Selling:</p> For posts with the #wts tag, you must include at least one (1) clear photo of the product you are selling. This ensures transparency and helps potential buyers make informed decisions.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>4. Reporting Inappropriate Content:</p> If you come across any listings (posts) that you find offensive, inappropriate, or in violation of these guidelines, please report them immediately. Click on the appropriate reporting option and provide relevant details. Our team will review and take appropriate action promptly.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>5. Contact Information:</p> In your profile About section, please include some form of contact information for communication purposes. This will allow interested buyers or sellers to reach out to you. However, avoid sharing sensitive personal information publicly.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>6. Private Chat Feature (Upcoming Update):</p> In the next update, we will introduce a private chat feature to enhance communication convenience. This will enable buyers and sellers to interact directly, discuss details, and negotiate terms more efficiently. Be sure to utilize this feature responsibly and within the boundaries of respectful communication.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>7. Platform Responsibility:</p> DsonMarket serves solely as a marketplace platform, acting as a mediator between buyers and sellers. We do not take responsibility for any issues that may arise during transactions or interactions between individuals. Please exercise caution, verify the authenticity and legality of items, and engage in due diligence when conducting transactions.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>8. Compliance with Applicable Laws:</p> Ensure that all listings and transactions on DsonMarket comply with local, state, and federal laws. It is your responsibility to know and adhere to any legal obligations related to the items you are selling or purchasing.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>9. Honesty and Accuracy:</p> Provide honest and accurate information about the items you are selling or buying. Avoid misleading or false representations to maintain trust within the community.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>10. Feedback and Disputes:</p> Engage in constructive feedback and address any disputes in a respectful manner. If you encounter any issues during a transaction, try to resolve them through open communication first. If necessary, seek assistance from DsonMarket administrators.
            </li>
          </ul>
        </div>
      </UserContextProvider>
    </Layout>
  );
}

export default PurchasedPosts;
