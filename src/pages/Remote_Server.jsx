import React, { useState, useEffect } from 'react'
import { check_token } from '../auth/Auth_token.jsx';
import { useNavigate } from 'react-router-dom';


// two api calls

// GET(/api/config/remote-server)  fill the fields with whatever is stored on the device
// POST(/api/config/remote-server) save the content, before posting call check_token


const Remote_Server = () => {

    const navigate = useNavigate();

    const [server_url, set_server_url] = useState("");
    const [server_port, set_server_port] = useState("");
    const [solution_type, set_solution_type] = useState("");
    const [client_id, set_client_id] = useState("");
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");

    const [msg, set_msg] = useState("");


    // whenever the page loads, fetch the saved data
    async function on_start() {
        try {
            
            // i ca add other thing is that if it doesnot fetch the token status then just get the token from the session
            // and compare
            // await check_token(navigate);

            const response = await fetch("/api/config/remote-server", {
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

            const res = await response.json();

            if (!res.Flag) {
                console.log("Flag is not set");
                return;
            }

            set_server_url(res.Data.server_url);
            // spec: unconfigured integer comes back as 0, show it as empty
            set_server_port(res.Data.server_port ? String(res.Data.server_port) : "");
            set_solution_type(res.Data.solution_type);
            set_client_id(res.Data.client_id);
            set_username(res.Data.username);

            // The device returns the password masked ("******"), never the real one.
            // Do NOT put it in the field, or the mask would be saved as the password.
            // The user must type the password again, because all fields are mandatory.
        }
        catch (err) {
            console.log(err.message);
        }
    }


    async function clicked(e) {
        e.preventDefault();

        // all six parameters are mandatory for this API
        const isValid = !!(server_url && server_port && solution_type && client_id && username && password);

        if (!isValid) {
            set_msg("Fill all the details");
            return;
        }

        

        try {

            // before post, validate the token
            // const token = await check_token(navigate);  unComment it if header is bearrer token for urlencoded
            // and this is what they asked in the pdf the urlencoded so use the 
            // headers: { 'Authorization': `Bearer ${token}` },
            await check_token(navigate);

            const response = await fetch("/api/config/remote-server", {
                method: 'POST',
                // the spec wants form-urlencoded (not JSON), the browser sets the Content-Type itself
                // headers: { 'Authorization': `Bearer ${token}` },
                headers:{'Content-Type': 'application/json'},
                body: new URLSearchParams({
                    server_url: server_url,
                    server_port: server_port,
                    solution_type: solution_type,
                    client_id: client_id,
                    username: username,
                    password: password,
                })
            })

            if (response.status === 400) {
                set_msg("Required field not provided");
                return;
            }
            if (response.status === 422) {
                set_msg("Invalid format or value");
                return;
            }
            if (response.status === 500) {
                set_msg("Failed to save remote server configuration");
                return;
            }
            if (!response.ok) {
                set_msg("Server Error");
                return;
            }

            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const res = await response.json();
                if (!res.Flag) {
                    set_msg("Device rejected the configuration");
                    return;
                }
            }

            set_msg("Remote server configuration saved");

            // clear only the secret, keep the rest visible
            set_password("");
        }
        catch (err) {
            console.log(err.message);
            set_msg("Connection to the device lost");
        }
    }

    useEffect(() => {
        on_start();
    }, []);


    return (
        <div className='flex justify-center items-center min-h-[calc(100vh-6rem)] font-sans text-[13px] text-[#b3874a] uppercase '>
            <form action="" className='flex flex-col gap-[22px] w-[320px] px-7 pt-10 pb-8 bg-[#141414] border-t-4 border-[#f5a623] rounded' onSubmit={clicked}>
                <div className='flex flex-col gap-1.5'>
                    <div>SERVER URL</div>
                    <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150'  placeholder='Enter Server URL' value={server_url} onChange={(e) => {
                        set_server_url(e.target.value);
                    }} /></div>
                </div>
                <div className='flex flex-col gap-1.5'>
                    <div >Server_Port</div>
                    <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' placeholder='Enter Server Port' value={server_port} onChange={(e) => {
                        set_server_port(e.target.value);
                    }} /></div>
                </div>
                <div className='flex flex-col gap-1.5'>
                    <div>Solution Type</div>
                    <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' placeholder='Enter Solution Type' value={solution_type} onChange={(e) => {
                        set_solution_type(e.target.value);
                    }} /></div>
                </div>
                <div className='flex flex-col gap-1.5'>
                    <div>Client ID</div>
                    <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' placeholder='Enter Client ID' value={client_id} onChange={(e) => {
                        set_client_id(e.target.value);
                    }} /></div>
                </div>
                <div className='flex flex-col gap-1.5' >
                    <div>username</div>
                    <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' placeholder='Enter Username' value={username} onChange={(e) => {
                        set_username(e.target.value);
                    }} /></div>
                </div>
                <div className='flex flex-col gap-1.5'>
                    <div>Password</div>
                    <div><input type="text" className='w-full bg-transparent border-b border-[#3a3a3a] text-[#f0f0f0] text-[15px] px-0.5 py-1.5 outline-none placeholder:text-[#6b6b6b] focus:border-[#f5a623] transition-colors duration-150' placeholder='Enter Password' value={password} onChange={(e) => {
                        set_password(e.target.value);
                    }} /></div>
                </div>
                <button className='flex justify-center w-full mt-2.5 py-3 rounded-3xl bg-[#f5a623] text-[#141414] text-[15px] font-semibold cursor-pointer transition-colors duration-150 hover:bg-[#e0961a] active:bg-[#c8830f]' >Submit</button>

                {msg && <div>{msg}</div>}
            </form>
        </div>
    )
}

export default Remote_Server