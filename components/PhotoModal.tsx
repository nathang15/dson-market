import React, {useState} from 'react';

/**
 * PhotoModal component displays an enlarged photo with navigation and a close button.
 *
 * @param {Object} props - The component props.
 * @param {string} props.photo - The URL of the photo to display.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onNavigateLeft - Function to navigate to the previous photo.
 * @param {Function} props.onNavigateRight - Function to navigate to the next photo.
 * @return {React.JSX} - Render the Photo Modal
 */
function PhotoModal({photo, onClose, onNavigateLeft, onNavigateRight}) {
  const [showTooltip, setShowTooltip] = useState(false);

  /**
   * Handle mouse hover event to show the close button tooltip.
   */
  const handleMouseHover = () => {
    setShowTooltip(true);
  };

  /**
   * Handle mouse leave event to hide the close button tooltip.
   */
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  /**
   * Handle close button click event.
   */
  const handleButtonClick = () => {
    onClose();
  };

  /**
   * Handle left arrow button click event.
   */
  const handleLeftArrowClick = () => {
    onNavigateLeft();
  };

  /**
   * Handle right arrow button click event.
   */
  const handleRightArrowClick = () => {
    onNavigateRight();
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
      <div className="max-w-2xl mx-auto p-4 relative">
        <div>
          <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden relative p-2">
            <img src={photo} alt="Enlarged Photo" className="max-w-full max-h-full" />
            <button
              className="absolute top-4 left-4 text-white hover:text-gray-300 hover:bg-gray-400 rounded-full transition-colors duration-300"
              onClick={handleButtonClick}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseLeave}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {showTooltip && (
                <div className="absolute -right-8 mt-1 transform translate-x-1/2 flex items-center justify-center bg-gray-200 text-gray-800 rounded-md py-1 px-2 shadow-md z-50">
                  <span className="whitespace-nowrap">Press Esc to close</span>
                </div>
              )}
            </button>
            <button
              className="absolute top-1/2 transform -translate-y-1/2 left-4 text-white hover:text-gray-300 hover:scale-110 bg-gray-400 rounded-full transition-all"
              onClick={handleLeftArrowClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="absolute top-1/2 transform -translate-y-1/2 right-4 text-white hover:text-gray-300 hover:scale-110 bg-gray-400 rounded-full  transition-all"
              onClick={handleRightArrowClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
          <div className="bg-black w-1/4 h-full z-40"></div>
        </div>
      </div>
    </div>
  );
}

export default PhotoModal;
