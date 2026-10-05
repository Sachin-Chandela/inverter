import React, { useState } from 'react'
import { check_token, get_token } from '../auth/Auth_token.jsx';
import { useNavigate } from 'react-router-dom';

const Wifi = () => {

    const [ssid,set_ssid]=useState("");
    const [wifi_pass,set_wifi_pass]=useState("");

    const [username,set_username]=useState("");
    const [user_pass,set_user_pass]=useState("");


    const navigate=useNavigate();





    async function clicked(e){
        e.preventDefault();

        const isValid=!!(ssid && wifi_pass && username && user_pass);


        if(!isValid){
            console.log("fill all the details first");
            return;
        }


        try{
            
            // const token=await get_token(navigate);

            // unComment the upper code for final call
            // const token=12121311
            

            if(token==-1){
                // i will be redirected to the login page only but just for the sake
                console.log("No token Login again");
                return;
            }

            // console.log("h");

            const response = await fetch("/api/device/config/update",{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({
                    Flag:true,
                    Message:"success",
                    Data:{
                        wifi_ssid:ssid,
                        wifi_password:wifi_pass,
                        device_username:username,
                        device_password:user_pass,
                    }
                })
            })
            // console.log("h");

            if(response.status===401){
                console.log("Authentication failed");
                return;
            }
            if(response.status===404){
                console.log("Required parameters not provided");
                return;
            }
            if(response.status===422){
                console.log("SSID or password invalid");
                return;
            }
            console.log("h");
            if(response.status===500){
                console.log("Failed to save configuration");
                return;
            }
            if(!response.ok){
                console.log("Response not Ok");
                return;
            }


            const res=response.json();
            if(res.Flag){
                console.log("Success");
                return;
            }
            else{
                console.log("Flag is not set/some error occured");
                return
            }

        }
        catch(err){
            console.log("Network Error");
            return;
        }

    }



  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-6rem)] font-sans text-[13px] text-[#b3874a] uppercase '>
        <form action="" onSubmit={clicked} className='flex flex-col gap-[22px] w-[320px] px-7 pt-10 pb-8 bg-[#141414] border-t-4 border-[#f5a623] rounded'>
            <div className='flex flex-col gap-1.5'>
                <div>WIFI SSID</div>
                <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150'  placeholder='Enter Wifi ssid' value={ssid} onChange={(e)=>{
                    set_ssid(e.target.value);
                }}/></div>
            </div>
            <div className='flex flex-col gap-1.5'>
                <div>WIFI PASSWORD</div>
                <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150'  placeholder='Enter WIFI Password' value={wifi_pass} onChange={(e)=>{
                    set_wifi_pass(e.target.value);
                }} /></div>
            </div>
            <div className='flex flex-col gap-1.5'>
                <div>DEVICE USERNAME</div>
                <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150'  placeholder='enter device username' value={username} onChange={(e)=>{
                    set_username(e.target.value);
                }} /></div>
            </div>
            <div className='flex flex-col gap-1.5'>
                <div>DEVICE PASSWORD</div>
                <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150'  placeholder='Enter Password' value={user_pass} onChange={(e)=>{
                    set_user_pass(e.target.value);
                }}/></div>
            </div>


            <button className='flex justify-center w-full mt-2.5 py-3 rounded-3xl bg-[#f5a623] text-[#141414] text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#e0961a] active:bg-[#c8830f]'>Submit</button>
        </form>
    </div>
  )
}

export default Wifi;