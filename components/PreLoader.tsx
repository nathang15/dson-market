import React from 'react';
import {PulseLoader} from 'react-spinners';

/**
 * A loading animation
 * @return {React.JSX} - Render the Loading Animation
 */
function PreLoader() {
  return (
    <div><PulseLoader size={7} speedMultiplier={0.7} color={'#EF4444'}/></div>
  );
}

export default PreLoader;
