import React, { useState } from 'react'
import { check_token, get_token } from '../auth/Auth_token';
import { useNavigate } from 'react-router-dom';

const Certificate = () => {


    const navigate=useNavigate();

    let URL="write.html";


    const [message, setMessage] = useState("");
    const [countdown, setCountdown] = useState(0);

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    async function waitWithTimer(seconds, text) {
        setMessage(text);
        for (let s = seconds; s > 0; s--) {
            setCountdown(s);
            await sleep(1000);
        }
        setCountdown(0);
    }

    async function getStatus(headers) {
        const response = await fetch("/api/device/broker/status", { headers });
        if (!response.ok) return null;
        const res = await response.json();
        return res.Data?.status ?? null;
    }

    async function establish_connection() {
        const token=get_token(navigate);
        const headers = { Authorization: `Bearer ${token}` };

        // Step 1: trigger (no body needed)
        const response = await fetch("/api/device/broker/connect", {
            method: "POST",
            headers,
        });
        if (!response.ok) {
            setMessage("Trigger request failed");
            return;
        }

        const res = await response.json();
        const flag = res.Flag ?? res.FLAG; // PDF uses both spellings
        if (!flag || res.Data?.status === -1) {
            setMessage(`Error: ${res.Data?.error ?? "Trigger rejected"}`);
            return;
        }

        // Step 2-3: wait 60s, then check status
        await waitWithTimer(60, "Connecting... checking status in");
        let status = await getStatus(headers);

        if (status === 6) { setMessage("Connected successfully"); return; }
        if (status === -1 || status === null || status === 0) {
            setMessage("Connection failed");
            return;
        }

        // Step 4-5: status is 1-5, wait 30s and check once more
        await waitWithTimer(30, "Still connecting... retrying in");
        status = await getStatus(headers);

        // Step 6
        if (status === 6) setMessage("Connected successfully");
        else setMessage("Connection failed (still in progress after 90s)");
    }


    async function upload(file,filename){

        // to get the file name use the file.name

        const url=`${URL}?filename=${filename}`;

        try{
            const text = await file.text();

            const response=await fetch(url,{
                method:'POST',
                headers:{
                    "Content-Type":"Text/plain"
                },
                body:text

            })

            if(!response.ok){
                console.log("File Not Sent");
                return false;
            }

            const res=await response.json();

            if(!res.Flag){
                console.log("Flag is not set");
                return false;

            }

            console.log(`${filename} uploaded`);
            return true;
        }
        catch(err){
            console.log(err.message);
            return false;
        }

    }


    async function uploadall(e){
        e.preventDefault();
        const file1=document.getElementById("root_ca").files[0];
        const file2=document.getElementById("client_ca").files[0];
        const file3=document.getElementById("private_key").files[0];

        const isValid=!!(file1 && file2 && file3);
        if(!isValid){
            console.log("Upload all the files!!!");
            return;
        }


        // await check_token(navigate);

        if (!(await upload(file1, "rootCA.pem"))) return;
        if (!(await upload(file2, "client.pem"))) return;
        if (!(await upload(file3, "key.pem"))) return;

        console.log("All files are upladed");

        establish_connection();

    }






  return (
    <div className='flex flex-col justify-center items-center min-h-[calc(100vh-6rem)] font-sans'>

        <form action="" onSubmit={uploadall} className='flex flex-col gap-[22px] w-[320px] px-7 pt-10 pb-8 bg-[#141414] border-t-4 border-[#f5a623] rounded' >


            <div className='flex flex-col gap-1.5'>
                <label htmlFor="root_ca" className='text-[13px] text-[#b3874a] uppercase'>Root CA</label>
                <input type="file" name="" id="root_ca" accept='.pem' className='w-full text-[13px] text-[#6b6b6b] border-b border-[#3a3a3a] py-1.5 file:bg-transparent file:border file:border-[#f5a623] file:rounded-[20px] file:text-[#f5a623] file:text-xs file:px-3.5 file:py-1 file:mr-2.5 file:cursor-pointer file:transition-colors file:duration-150 hover:file:bg-[#f5a623] hover:file:text-[#141414]' />
            </div>
            <div className='flex flex-col gap-1.5'>
                <label htmlFor="client_ca" className='text-[13px] text-[#b3874a] uppercase'>Client CA</label>
                <input type="file" name="" id="client_ca" accept='.pem' className='w-full text-[13px] text-[#6b6b6b] border-b border-[#3a3a3a] py-1.5 file:bg-transparent file:border file:border-[#f5a623] file:rounded-[20px] file:text-[#f5a623] file:text-xs file:px-3.5 file:py-1 file:mr-2.5 file:cursor-pointer file:transition-colors file:duration-150 hover:file:bg-[#f5a623] hover:file:text-[#141414]' />
            </div>
            <div className='flex flex-col gap-1.5'>
                <label htmlFor="private_key" className='text-[13px] text-[#b3874a] uppercase'>Private Key</label>
                <input type="file" name="" id="private_key" accept='.pem' className='w-full text-[13px] text-[#6b6b6b] border-b border-[#3a3a3a] py-1.5 file:bg-transparent file:border file:border-[#f5a623] file:rounded-[20px] file:text-[#f5a623] file:text-xs file:px-3.5 file:py-1 file:mr-2.5 file:cursor-pointer file:transition-colors file:duration-150 hover:file:bg-[#f5a623] hover:file:text-[#141414]' />
            </div>

            <button className='flex justify-center w-full mt-2.5 py-3 rounded-3xl bg-[#f5a623] text-[#141414] text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#e0961a] active:bg-[#c8830f]' >Submit</button>



        </form>

        {message && (
            <p className='mt-4 text-[13px] text-[#b3874a] text-center'>{message} {countdown > 0 && `${countdown}s`}</p>
        )}

    </div>
  )
}

export default Certificate