import React, { useState, useContext, useEffect } from 'react'
import { StateContext } from '../Provider/StateProvider'
import '../src/style/Animation.css'

function Option({ icon, icon_name,func }) {
    const { slide_state } = useContext(StateContext)
    return (
        <div className='cursor-pointer' onClick={func}>
            <span className={`flex items-center gap-4`} style={{ fontSize: "0px" }}>
                {icon}<p className={`w-fit ${slide_state == 'wait' ? '' : `${slide_state ? 'slide_open_animation' : 'slide_close_animation'}`}`}>{icon_name}</p>
            </span>
        </div>
    )
}

export default Option