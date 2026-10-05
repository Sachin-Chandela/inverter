



export function saveSession(token,valid_For){

    // i will call this only at the login page only

    sessionStorage.setItem(
        "token",
        JSON.stringify({ token, expiresAt: Date.now() + valid_For * 1000 })
    )

}


export async function get_token(navigate){

    // first i will check whether the token is valid and not expired i can do this in the wifi page only but its good here

    

    const temp=await check_token(navigate);
    if(!temp){
        return -1;
    }

    // if token is not valid then i will be redirected to the login page only
    // if true then i have the valid non expired token so just get the token and return it

    const response=sessionStorage.getItem('token');
    if(!response){
        return -1;
    }
    const res=JSON.parse(response);

    return res.token;
}


export async function check_token(navigate){

    try{

        // get the token from the session id
        const response1=sessionStorage.getItem('token');

        if(!response1){
            console.log("No Token found");
            navigate("/");
            return false;
        }

        const res1=JSON.parse(response1);
        const token=res1.token;


        // i will post the token  and in return it will check the time for me through the token only


        const response=await fetch("/api/auth/status",{
            headers:{
                "Authorization":`Bearer${token}`
            }
        });
        if(response.status===401){
            console.log("Token Invalidate");
            // throw back to the login url
            sessionStorage.removeItem("token");
            navigate("/");
            return false;

            
        }
        const res=await response.json();

        if(res.flag){
            return true;
        }
        else{
            navigate("/");
            return false;

        }
    }
    catch(err){
        console.log("Auth error:", err.message);
        navigate("/");
        return false;
    }
}


// also below is the function that moving from different pages in the APP.jsx  is the token is in the session storage


export async function check_session_storage(){

    // no need of it i can use the check token to get the time

    const response=sessionStorage.getItem('token');


    if(!response){
        return false;
    }

    const res=JSON.parse(response)
    const time=res.expiresAt


    if(time<Date.now()){
        // its already expired
        return false
    }
    else{
        return true
        // can move to that page or element
    }

} 




