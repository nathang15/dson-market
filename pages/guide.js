import React from 'react';
import Layout from '@/components/Layout';
import { UserContextProvider } from '../contexts/UserContext';

function Guideline() {
  return (
    <Layout>
      <UserContextProvider>
        <h1 className='flex justify-center md:text-5xl text-md mb-6 text-darkBG dark:text-lightBG underline decoration-red-500 decoration-4 -my-3 font-bold'>DsonMarket Community Guidelines</h1>
        
        <div className='flex justify-center'>
          <ul className='md:text-lg text-md text-darkBG dark:text-lightBG md:w-2/3 w-5/6 leading-loose'>
            <li>
              <p className='font-bold md:text-xl text-md'>Dickinson College values sustainability and prioritizes and promotes reuse of goods and sharing of skills and services within the Dickinson Community. The DsonMarket online community was designed to support the buying, selling and trading of goods and services by Dickinson students, faculty and staff. Built and maintained by Dickinsonians, for Dickinsonians. We aim to create a safe, inclusive online marketplace where you can save/make money, reduce carbon emissions and interact with others in support of sustainability at Dickinson.</p>
            </li>
            <br/>
            <span className='font-bold md:text-xl text-md'>This platform is supported by the Center for Sustainability Education.</span>
            <li>
            <br/>
              <p className='font-semibold underline decoration-red-500 decoration-4'>1. Respect and Courtesy:</p> Treat all members of the DsonMarket community with respect and courtesy. Be mindful of your language and interactions and recognize we prioritize inclusive practices and language. Engaging in personal attacks, harassment, or discrimination based on race, gender, religion, nationality, sexual orientation, or any other personal characteristics is forbidden and will result in elimination from the online marketplace.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>2. Post Tagging:</p> Every post must include either the #wanttobuy (#wtb) or #wanttosell (#wts) hashtag to indicate the purpose of your post. This helps others quickly identify your intentions and improve search functionality.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>3. Photo Requirement for Selling:</p> For posts with the #wanttosell (#wts) tag, you must include at least one (1) clear photo of the product you are selling. Up to 8 photos can be included in a #wanttosell post. This ensures transparency and helps potential buyers make informed decisions. Photos are optional on #wanttobuy (#wtb) posts and in the comments sections.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>4. Reporting Inappropriate Content:</p> If you come across any posts, listings or comments that you find offensive, inappropriate, or in violation of these guidelines, please report them immediately using the report function. Click on the appropriate reporting option and provide relevant details. Our team will review and take appropriate action promptly. Please do your part to keep this online community safe and reputable.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>5. Completed Exchanges:</p> We encourage users to mark all completed exchanges as such to reduce the number of unavailable items and ensure that only available products and services appear in searches. It will also help us track the success of the marketplace.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>6. Contact Information:</p> You must include some form of contact information in In your profile About section for communication and exchange purposes. This will allow interested buyers or sellers to reach out to you outside the online marketplace to arrange exchanges. Never share others personal information publicly.    
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>7. Financial Arrangements:</p> No money or financial information is to be stored, shared, or exchanged in this platform. Any sales should be completed using third party, protected financial applications like Venmo, Zell, etc. There is no financial protections provided by DsonMarket.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>8. Platform Responsibility:</p> DsonMarket serves solely as a marketplace platform, acting as a mediator between buyers and sellers. We do not take responsibility for any issues that may arise during transactions or interactions between individuals. Please exercise caution, verify the authenticity and legality of items, and engage in due diligence when conducting transactions.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>9. Compliance with Applicable Laws:</p> Ensure that all listings and transactions on DsonMarket comply with local, state, and federal laws. It is your responsibility to know and adhere to any legal obligations related to the items you are selling or purchasing.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>10. Honesty and Accuracy:</p> Provide honest and accurate information about the items you are selling or buying. Disclose all damages, imperfections and do not hide anything about products. Avoid misleading or false representations to maintain trust within the online Dickinson community.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>11. Feedback and Disputes:</p> Engage in constructive feedback and address any disputes in a respectful manner. If you encounter any issues during a transaction, try to resolve them through open communication first. If necessary, seek assistance from DsonMarket administrators using the feedback form. Comments and suggestions for improvement are welcomed.
            </li>
            <br/>
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>12. Upcoming Updates:</p> 
            <li>
            <p className='font-semibold underline decoration-red-500 decoration-4'>Private Chat Feature:</p> 
            </li>
            In the next update, we will introduce a private chat feature to enhance communication convenience. This will enable buyers and sellers to interact directly, discuss details, and negotiate terms more efficiently. Be sure to utilize this feature responsibly and within the boundaries of respectful communication.
            </li>
            <br/>
            <br/>
            <li className='md:text-xl text-lg'>
            This project was built and managed by the following students and is supported by <span className='font-bold'>The Center for Sustainability Education (CSE)</span>.
            </li>
            <br/>
            <li className='md:text-md text-sm font-bold'>
              Nathan Nguyen - Class 2025
            </li>
            <span className='dark:text-lightBG text-darkBG font-bold md:text-md text-sm flex justify-center mt-20'>© 2023 Dickinson College - The Center for Sustainability Education (CSE) • All right reserved.</span>
          </ul>
        </div>
      </UserContextProvider>
    </Layout>
  );
}

export default Guideline;
