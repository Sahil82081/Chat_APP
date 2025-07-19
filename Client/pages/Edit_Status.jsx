import React, { useContext, useEffect, useRef, useState } from 'react'
import { StateContext } from '../Provider/StateProvider'
import axios from 'axios'
import { deleteStatus } from '../urls/url'
function Edit_Status({ data }) {

    const { setEditStatus, token, SetUserStatus, userstatus } = useContext(StateContext)
    const statusref = useRef(null)

    const handleCloseAddPost = (e) => {
        if (statusref.current == e.target) {
            setEditStatus(false)
        }
    }
    const updatestatus = (statusid) => {
        const status = data.status.filter((status) => (status._id !== statusid))
        SetUserStatus({ status })
    }

    useEffect(() => {
        if (userstatus.status.length == 0) {
            setEditStatus(false)
        }
    }, [data])


    const handleStatusDelete = async (statusid) => {
        const header = {
            "Content-Type": "application/json",
            "Authorization": token
        }

        try {
            await axios.post(`${deleteStatus}`, { statusid }, {
                headers: header
            })
                .then((res) => {
                    console.log(res.data)
                    updatestatus(statusid)
                })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className='absolute h-full w-full top-0 flex justify-center items-center '
            style={{ backgroundColor: "#000000c9" }}
            onClick={handleCloseAddPost}
            ref={statusref}>
            <div className='bg-yellow-100 px-3 py-2 border rounded-lg '>
                <table className=' border-separate border-spacing-7' style={{ textAlign: 'center' }} >
                    <tr >
                        <th>Image</th>
                        <th>Caption</th>
                        <th></th>
                    </tr>
                    {data.status.map((status) => (
                        <tr>
                            <td className='flex justify-center'><img src={status.post_url} alt="" className='h-16' /></td>
                            <td>{status.caption}</td>
                            <td>
                                <button onClick={() => handleStatusDelete(status._id)}
                                    className='text-lg bg-yellow-300 h-fit px-2 rounded-lg py-1'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Edit_Status