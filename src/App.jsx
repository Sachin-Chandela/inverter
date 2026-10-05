import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Config from './pages/Config.jsx'
import { Isp } from './pages/Isp.jsx'
import Remote_Server from './pages/Remote_Server.jsx'
import Certificate from './pages/Certificate.jsx'
import Wifi from './pages/Wifi.jsx'

const App = () => {
  return (


    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="config" element={<Config/>} >
        <Route index element={<Isp/>}/>
        <Route path="isp" element={<Isp/>}/>
        <Route path="remote-server" element={<Remote_Server/>}/>
        <Route path="certificate" element={<Certificate/>}/>
        <Route path="wifi" element={<Wifi/>}/>
         
        

      </Route>

    </Routes>
  )
}

export default App