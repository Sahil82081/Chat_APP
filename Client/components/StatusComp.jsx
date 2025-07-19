import React, { useContext } from 'react'
import { StateContext } from '../Provider/StateProvider'
import profile from '../Photo/man.png'
function StatusComp({ data }) {
    console.log(data)
    const { SetIsStatus, Set_Curr_Status_User } = useContext(StateContext)
    return (
        <div className='flex items-center p-3 gap-3'>
            <div>
                <img src={profile} alt="" className='h-11 rounded-full border-2 border-green-600' />
            </div>
            <div onClick={() => {
                SetIsStatus(true)
                Set_Curr_Status_User(data._id)
            }}>
                <p>{data.name}</p>
            </div>
        </div>
    )
}

export default StatusComp