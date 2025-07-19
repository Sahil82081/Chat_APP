import React, { useContext, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Call from "../icon/Call"
import Chat from '../icon/Chat'
import Status from '../icon/Status'
import Menu from '../icon/Menu'
import Option from '../components/Option'
import Loader from '../components/Loader'
import { StateContext } from '../Provider/StateProvider'
function Layout() {
    const navigate = useNavigate()

    const { isloading } = useContext(StateContext)
    return (
        <>
            <div className='h-screen flex flex-col lg:flex-row '>
                <div className='p px-4 pt-4 pb-1 flex flex-col gap-5 bg-yellow-300 lg:hidden'>
                    <h1 className='font-bold text-xl'>Chat App</h1>
                    <div className='grid grid-cols-3 place-content-center gap-2 text-center lg:grid-cols-1'>
                        <span>
                            <NavLink to={"/"}>Chat</NavLink>
                        </span>
                        <span>
                            <NavLink to={"/status"}>Status</NavLink>
                        </span>
                        <span>
                            <NavLink to={"/calls"}>Calls</NavLink>
                        </span>
                    </div>
                </div>
                <div className='bg-yellow-300 p-2 lg:flex flex-col gap-8 hidden '>
                    <div className=''>
                        <Menu />
                    </div>
                    <Option icon={<Chat />} icon_name={'Chat'} func={() => { navigate('/') }} />
                    <Option icon={<Status />} icon_name={'Status'} func={() => { navigate('/status') }} />
                    <Option icon={<Call />} icon_name={'Call'} func={() => { alert("This Option will Available Soon") }} />
                </div>
                <div className='flex-1'>
                    <Outlet />
                </div>
            </div>
            {isloading ? <Loader /> : ""}
        </>
    )
}

export default Layout