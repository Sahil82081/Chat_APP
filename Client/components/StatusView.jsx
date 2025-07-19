import React, { useContext, useEffect, useRef, useState } from 'react'
import { StateContext } from '../Provider/StateProvider'

function StatusView({ data }) {
  const [curridx, setCurrIdx] = useState(0)
  const { SetIsStatus, Set_Curr_Status_User } = useContext(StateContext)
  const statusref = useRef(null)

  const handleimage = () => {
    if (curridx < data.status.length - 1) {
      setCurrIdx((prev) => prev + 1)
    }
    else {
      SetIsStatus(false)
      setCurrIdx(0)
      Set_Curr_Status_User(null)
    }
  }
  const handleCloseAddPost = (e) => {
    if (statusref.current == e.target) {
      SetIsStatus(false)
    }
}

  return (
    <div
      className='absolute h-full w-full flex justify-center items-center top-0'
      style={{ backgroundColor: "#000000c9" }}
      ref={statusref}
      onClick={handleCloseAddPost}>
      <div className='h-fit w-fit' >

        {data ? (
          <>
            <img src={data.status[curridx].post_url} alt=""
              className='h-1'
              style={{height:"32vh"}}
              onClick={handleimage}
            />
            <div className='p-3 flex justify-center items-center text-xl' 
            style={{color:"white"}}>
              <p className='text-white'>{data.status[curridx].caption}</p>
            </div>
          </>
        )
          :
          ""
        }

      </div>
    </div>
  )
}

export default StatusView