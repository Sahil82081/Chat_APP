import React, { useContext, useState } from 'react'
import InputField from '../components/InputField'
import Loader from '../components/Loader'
import { login } from '../urls/url'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StateContext } from '../Provider/StateProvider'
function Login() {
    const navigate = useNavigate()

    const { SetToken, isloading } = useContext(StateContext)
    const [userdata, setUserdata] = useState({
        name: "",
        email: "",
        password: ""
    })

    const changedata = (e) => {
        const name = e.target.name
        const value = e.target.value
        setUserdata((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (data) => {
        try {
            await axios.post(`${login}`, data, {
                "Content-Type": "application/json"
            }).then((res) => {
                console.log(res.data.message)
                localStorage.setItem('token', res.data.token)
                SetToken(res.data.token)
                if (res.status == 200) {
                    navigate('/')
                }
            })
        } catch (error) {
            console.log(error.response.data.error)
        }
    }

    return (
        <div className='h-screen bg-yellow-300 flex items-center justify-center'>
            <div className='flex flex-col gap-2'>
                <InputField filed={"E-mail"} filed_name={'email'} p_holder={'E-mail'} func={(e) => changedata(e)} val={userdata.email} />
                <InputField filed={"Password"} filed_name={'password'} p_holder={'Password'} func={(e) => changedata(e)} val={userdata.password} />
                <div className='my-2'>
                    <button className='bg-yellow-100 text-xl px-2 py-1 rounded-lg w-full'
                        onClick={() => { handleSubmit(userdata) }}>Login</button>
                    <p className='text-lg'>If You Don't have Account ? <NavLink className='text-blue-700' to={'/signup'}>Click Here</NavLink></p>
                </div>
            </div>
            {isloading ? <Loader /> : ""}
        </div>
    )
}

export default Login