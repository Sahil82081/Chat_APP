import React, { useContext } from 'react'
import profile from '../Photo/man.png'
import { useNavigate } from 'react-router-dom'
import CallingBtn from '../icon/CallingBtn'
function Contact({ user, func }) {
    const navigate = useNavigate()
    return (
        <>
            <div className='flex gap-4 items-center' style={{ padding: '10px' }} onClick={() => { navigate(`chat/${user._id}`) }} key={user._id}>
                <img src={profile} style={{ height: '50px', width: "50px" }} />
                <span className='w-fit flex-1'>
                    {user.name}
                </span>
                <div className='px-5' onClick={(e) => {
                    e.stopPropagation();
                    func(user._id)
                }}>
                    <CallingBtn />
                </div>
            </div>
        </>
    )
}

export default Contact