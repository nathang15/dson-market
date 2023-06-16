  import React from 'react';
  import Avatar from './Avatar';
  import Link from 'next/link';
  import ReactTimeAgo from 'react-time-ago';


  function ReviewsInfo({ reviews }) {
    return (
      <div>
        {reviews.map((review) => (
          <div className='border-b border-b-gray-200 shadow-md p-4 -mx-4' key={review.id}>
            <div className='flex items-center gap-2'>
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
              <span className='text-gray-500 text-sm'><ReactTimeAgo timeStyle={'twitter'} date={(new Date(review.created_at)).getTime()} /></span>
             
            </div>
            <div className='flex mx-16 text-lg leading-3'>{review.content}</div>
          </div>
        ))}
      </div>
    );
  }

  export default ReviewsInfo;
