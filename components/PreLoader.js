import React from 'react'
import { PulseLoader } from 'react-spinners';
function PreLoader() {
  return (
    <div><PulseLoader size={7} speedMultiplier={0.7} color={'#EF4444'}/></div>
  )
}

export default PreLoader