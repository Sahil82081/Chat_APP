import React, { useContext, useEffect, useState } from 'react'
import Add_Stories from './Add_Stories'
import { StateContext } from '../Provider/StateProvider'
import axios from 'axios'
import { get_status } from '../urls/url'
import StatusComp from '../components/StatusComp'
import StatusView from '../components/StatusView'
import Edit_Status from './Edit_Status'
import Profile from '../Photo/man.png'
function Status() {
    const { SetIsPosting, isposting, users, token, isStatus, curr_status_user, SetIsStatus,
        Set_Curr_Status_User, setEditStatus, isEditStatus, SetUserStatus, userstatus } = useContext(StateContext)

    const [otherstatus, SetOtherStatus] = useState([])

    const handleStatus = async (ids) => {
        try {
            await axios.post(`${get_status}`, ids, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            })
                .then((res) => {
                    console.log(res.data.other_status)
                    SetOtherStatus(res.data.other_status)
                    SetUserStatus(res.data.userstatus)
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (users.length !== 0) {
            const ids = users.map((user) => {
                return user._id;
            })
            handleStatus(ids)
        }
    }, [users])
    console.log(curr_status_user)
    return (
        <div>
            <div className='flex items-center p-3 gap-3'>
                <div>
                    <img src={Profile} alt="" className='h-11 rounded-full border-2 border-green-600' />
                </div>
                <div className='flex-1 flex justify-between gap-6'>
                    <p className='flex-1'
                        onClick={() => {
                            if (userstatus.status != 0) {
                                SetIsStatus(true)
                            }
                        }}>You</p>
                    {userstatus.status.length != 0
                        ?
                        (<button
                            className=' bg-yellow-300 px-2 py-1 rounded-lg text-sm'
                            onClick={() => { setEditStatus(true) }}
                        >Edit Stories</button>)
                        : ""
                    }

                    <button
                        className=' bg-yellow-300 px-2 py-1 rounded-lg text-sm'
                        onClick={() => { SetIsPosting(true) }}
                    >Add Stories</button>
                </div>
            </div>

            {otherstatus.map((data) => {
                if (data.status.length != 0) {
                    return <StatusComp data={data} />
                }
            })}

            {isposting ? <Add_Stories /> : ""}

            {isStatus ?
                (curr_status_user ? (
                    otherstatus.map((status) => {
                        if (status._id == curr_status_user) {
                            return <StatusView data={status} />
                        }
                    }))
                    :
                    (<StatusView data={userstatus} />)
                )
                : ""}
            {isEditStatus ? (<Edit_Status data={userstatus} />) : ""}

        </div>
    )
}

export default Status