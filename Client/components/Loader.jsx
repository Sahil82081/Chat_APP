import React from 'react'
import '../src/style/Loader.css'
function Loader() {
  return (
    <div className='absolute top-0 w-screen h-screen z-50 flex items-center justify-center outer'>
        <span className="loader"></span>
    </div>
  )
}

export default Loader