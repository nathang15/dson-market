  import React from 'react';
  import Avatar from './Avatar';
  import Link from 'next/link';
  import ReactTimeAgo from 'react-time-ago';


  function ReviewsInfo({ reviews }) {
    return (
      <div>
        {reviews.map((review) => (
          <div className='border-2 dark:border-customBlack border-lightBorder dark:bg-customBlack2 bg-lightBG rounded-full px-4 py-4 mb-2' key={review.id}>
            <div className='flex gap-2'>
              <div>
                <Link href={'/profile/' + review.author.id}>
                  <span className='cursor-pointer'>
                    <Avatar url={review.author.avatar}/>
                  </span>
                </Link>
              </div>
              <Link href={'/profile/' + review.author.id}>
                  <span className="hover:underline font-semibold mr-1 text-md">
                    {review.author.name}
                  </span>
              </Link>
              <span className='text-gray-500 dark:text-lightBG text-sm mt-0.5'><ReactTimeAgo timeStyle={'twitter'} date={(new Date(review.created_at)).getTime()} /></span>
             
            </div>
            <div className='flex mx-16 text-lg leading-3 -mt-4 dark:text-lightBG'>{review.content}</div>
          </div>
        ))}
      </div>
    );
  }

  export default ReviewsInfo;
