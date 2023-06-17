import React from 'react';

function Card({ children, noPadding }) {
  let classes = 'bg-white dark:bg-customBlack dark:border-customBlack2 border-2 border-lightBorder rounded-md p-4 mb-5'
  if(noPadding){
    classes = 'bg-white dark:bg-customBlack dark:border-customBlack2 border-2 border-lightBorder rounded-xl mb-5'
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
      <div className={classes} style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  );
}

export default Card;
