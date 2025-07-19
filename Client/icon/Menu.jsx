import React, { useContext } from 'react'
import { StateContext } from '../Provider/StateProvider'
function Menu() {
    const { slide_state, set_slide_state } = useContext(StateContext)
    const menuclick = () => {
        if (slide_state == 'wait') {
            set_slide_state(true)
        }
        else {
            set_slide_state((prev) => !prev)
        }
    }
    return (
        <div onClick={menuclick}>
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export default Menu