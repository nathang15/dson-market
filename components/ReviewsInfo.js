import React from 'react';
import Avatar from './Avatar';
import Link from 'next/link';
import ReactTimeAgo from 'react-time-ago';

/**
 * React component for displaying reviews and associated user information.
 * @param {Object[]} reviews - An array of review objects to display.
 * @param {string} reviews[].id - The unique identifier of the review.
 * @param {string} reviews[].content - The content of the review.
 * @param {Object} reviews[].author - The author of the review.
 * @param {string} reviews[].author.id - The unique identifier of the author.
 * @param {string} reviews[].author.name - The name of the author.
 * @param {string} reviews[].author.avatar - The URL of the author's avatar.
 * @param {string} reviews[].created_at - The creation date and time of the review.
 * @return {JSX.Element} The rendered React component.
 */
function ReviewsInfo({reviews}) {
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
              <span className="hover:underline font-semibold mr-1 md:text-lg text-xs">
                {review.author.name}
              </span>
            </Link>
            <span className='text-gray-500 dark:text-lightBG md:text-sm text-xs md:mt-0.5 mt-1'><ReactTimeAgo timeStyle={'twitter'} date={(new Date(review.created_at)).getTime()} /></span>

          </div>
          <div className='flex ml-16 md:text-lg text-sm leading-3 md:-mt-4 -mt-6 dark:text-lightBG'>{review.content}</div>
        </div>
      ))}
    </div>
  );
}

export default ReviewsInfo;
