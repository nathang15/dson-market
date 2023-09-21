import React from 'react';

/**
 * Card Component - A reusable component for creating cards with customizable styling.
 *
 * @component
 * @param {Object} props - The properties for configuring the card.
 * @param {ReactNode} props.children - The content to be displayed inside the card.
 * @param {boolean} [props.noPadding] - If true, removes padding and uses rounded-xl styling.
 * @return {ReactElement} Returns a React component that displays a card with the specified content.
 */
function Card({children, noPadding}) {
  let classes = 'bg-white dark:bg-customBlack dark:border-customBlack2 border-2 border-lightBorder rounded-md p-4 mb-5';
  if (noPadding) {
    classes = 'bg-white dark:bg-customBlack dark:border-customBlack2 border-2 border-lightBorder rounded-xl mb-5';
  }
  return (
    <div
      className="card-wrapper"
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className={classes} style={{width: '100%'}}>
        {children}
      </div>
    </div>
  );
}

export default Card;
