import React from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const Config = () => {

    // const location=useLocation();

    const location=useLocation();
    const isActive=(path)=>{
        if(path==='isp' && location.pathname === '/config') return true
        return location.pathname.endsWith(path);
    }

const navigate=useNavigate();
return (

    <div className='min-h-screen bg-[#0c0c0c] font-sans'>
        <nav className='  grid grid-cols-4 max-w-xl mx-auto mt-8 overflow-hidden rounded bg-[#141414] border-t-4 border-[#f5a623]'>
            <div className='flex justify-center border-r border-[#3a3a3a]'><button className={`w-full py-3 text-[15px] cursor-pointer transition-colors duration-150 ${isActive('isp') ? 'bg-[#f5a623] text-[#141414] font-semibold hover:bg-[#e0961a]' : 'text-[#b3874a] hover:bg-[#1c1c1c] hover:text-[#f0f0f0]'}`} onClick={()=>{
            navigate("isp")
                        }}>Isp</button>
            </div>

            <div className='flex justify-center border-r border-[#3a3a3a]'><button className={`w-full py-3 text-[15px] cursor-pointer transition-colors duration-150 ${isActive('remote-server') ? 'bg-[#f5a623] text-[#141414] font-semibold hover:bg-[#e0961a]' : 'text-[#b3874a] hover:bg-[#1c1c1c] hover:text-[#f0f0f0]'}`} onClick={()=>{
            navigate("remote-server")
                        }}>Remote Server</button>
            </div>

            <div className='flex justify-center border-r border-[#3a3a3a]'><button className={`w-full py-3 text-[15px] cursor-pointer transition-colors duration-150 ${isActive('certificate') ? 'bg-[#f5a623] text-[#141414] font-semibold hover:bg-[#e0961a]' : 'text-[#b3874a] hover:bg-[#1c1c1c] hover:text-[#f0f0f0]'}`} onClick={()=>{
            navigate("certificate");
                        }}>Certificate</button>
            </div>

            <div className='flex justify-center'><button className={`w-full py-3 text-[15px] cursor-pointer transition-colors duration-150 ${isActive('wifi') ? 'bg-[#f5a623] text-[#141414] font-semibold hover:bg-[#e0961a]' : 'text-[#b3874a] hover:bg-[#1c1c1c] hover:text-[#f0f0f0]'}`} onClick={()=>{
            navigate("wifi");
                        }}>Wifi</button>
            </div>
        </nav>

    <Outlet/>
    </div>
  )
}

export default Config