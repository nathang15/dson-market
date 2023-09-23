import React from 'react';

/**
 * PostFormConfirmation component for creating and posting new content.
 * @component
 * @param {Object} props - The component's props.
 * @param {function} props.onConfirm - A callback function to execute after confirm.
 * @param {function} props.onCancel - A callback function to execute after cancel.
 * @return {JSX.Element|null} - Returns the PostFormCard component JSX or null if the post is successful.
 */
function PostConfirmationPop({onConfirm, onCancel}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-lightBG dark:bg-customBlack dark:border-customBlack2 dark:border-3 p-4 rounded-lg shadow-lg">
        <p className='md:text-md text-sm dark:text-lightBG text-darkBG'>The photos will not be able to edit later. Do you want to proceed?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="mr-2 bg-gray-300 transition-all hover:scale-110 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md dark:bg-customBlack dark:text-lightBG dark:border-customBlack2 border-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 transition-all hover:scale-110 hover:bg-red-600 text-lightBG px-4 py-2 rounded-md dark:bg-customBlack dark:border-customBlack2 border-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostConfirmationPop;
