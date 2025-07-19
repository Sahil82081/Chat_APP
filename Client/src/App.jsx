import { Home, Layout, Chat_Container, Sign_Up, Login, VoiceCall, Status } from '../pages'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { StateProvider } from '../Provider/StateProvider'
import { SocketProvider } from '../Provider/SocketProvider'
import { WebProvider } from '../Provider/WebRTC'

function App() {

  return (
    <>
      <WebProvider>
        <SocketProvider>
          <StateProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path='status' element={<Status />} />
                </Route>
                <Route path='/chat/:id' element={<Chat_Container />} />
                <Route path='/signup' element={<Sign_Up />} />
                <Route path='/login' element={<Login />} />
                <Route path='/voicecall/:id' element={<VoiceCall />} />
              </Routes>
            </BrowserRouter>
          </StateProvider>
        </SocketProvider>
      </WebProvider>
    </>
  )
}

export default App
