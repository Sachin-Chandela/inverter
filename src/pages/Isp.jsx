import React, { useState,useEffect } from 'react'
import { check_token } from '../auth/Auth_token.jsx';
import { useNavigate } from 'react-router-dom';





// two api calls


// Get(/api/config/isp)  whatever the data we have it here populate that filds according to it

// POST(/api/config/isp) post the content there before posting call the function check_token








export const Isp = () => {


    const navigate=useNavigate();

    const[apn,set_apn]=useState("");
    const[sim,set_sim]=useState("");
    const[username,set_username]=useState("");
    const[password,set_password]=useState("");



    // i want that whenever the first time the page reloads it fetch all the data

    async function on_start(){
        try{

            // await check_token(navigate);


            
            const response=await fetch("/api/config/isp",{
                // headers: { 'Authorization': `Bearer ${token}` }
                headers:{'Content-Type': 'application/json'},
            });

            if (!response.ok) {
                console.log(`Server responded with status: ${response.status}`);
                return;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.log("Backend server is unreachable or returned non-JSON data");
                return;
            }

            const res=await response.json();

            if(!res.Flag){
                console.log("Flag is not set");
                return;
            }

            set_apn(res.Data.apn);
            set_sim(res.Data.set_sim);
            set_username(res.Data.username);
            set_password(res.Data.set_password);
        }
        catch(err){
            console.log(err.message);
        }
    }
    
    async function clicked(e){
        e.preventDefault();


        const isValid=!!(apn && sim && username && password);


        if(!isValid){
            console.log("fill all the details")
            return;
        }


        try{

            // before post try to valid the token


            // await check_token(navigate);



            const response=await fetch("/api/config/isp",{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({
                    Flag:true,
                    Message:"success",
                    Data:{
                        apn:apn,
                        current_sim:sim,
                        username:username,
                        password:password,
                    }
                })
            })

            if(response.status===400){
                console.log("Apn not provided");
                return;
            }
            if(response.status===422){
                console.log("Parameter format or value error");
                return;
            }
            if(response.status===500){
                console.log("Failed to save ISP configuration");
                return;
            }
            if (!response.ok) {
                console.log("Server Error");
                return;
            }



            

            const res=response.json();

            if(!res.Flag){
                console.log("Flag is not set")
                // return;
            }

            set_apn("");
            set_sim("");
            set_username("");
            set_password("");
        }
        catch(err){
            console.log(err.message);
        }
    }

    useEffect(()=>{
        on_start();
    },[]);




    
  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-6rem)] font-sans'>
        <form action="" className='flex flex-col gap-[22px] w-[320px] px-7 pt-10 pb-8 bg-[#141414] border-t-4 border-[#f5a623] rounded'  onSubmit={clicked}>
            <div className='flex flex-col gap-1.5'>
                <div className='text-[13px] text-[#b3874a] uppercase'>APN</div>
                <div ><input className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150'  type="text" placeholder='Enter APN' value={apn} onChange={(e)=>{
                    set_apn(e.target.value);
                }} /></div>
            </div>

            <div className='flex flex-col gap-1.5'>
                <div className='text-[13px] text-[#b3874a] uppercase'>current sim</div>
                <div><input className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' type="text" placeholder='Enter Sim Detail'value={sim} onChange={(e)=>{
                    set_sim(e.target.value);
                }} /></div>
            </div>

            <div className='flex flex-col gap-1.5'>
                <div className='text-[13px] text-[#b3874a] uppercase'>username</div>
                <div><input className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' type="text" placeholder='Enter Usename' value={username}  onChange={(e)=>{
                    set_username(e.target.value);
                }}/></div>
            </div>
            <div className='flex flex-col gap-1.5'>
                <div className='text-[13px] text-[#b3874a] uppercase'>Password</div>
                <div><input className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' type="text" placeholder='Enter Password' value={password} onChange={(e)=>{
                    set_password(e.target.value);
                }} /></div>
            </div>


            <button className='flex justify-center w-full mt-2.5 py-3 rounded-3xl bg-[#f5a623] text-[#141414] text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#e0961a] active:bg-[#c8830f]'>Submit</button>
        </form>

        
            
        
    
        
    </div>

    

    // <div className='flex justify-center items-center'> THis is the hjhjkvjkdfjk  ISP</div>
  )
}