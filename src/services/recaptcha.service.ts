type RecaptchaResponse={
    success:boolean;
    challenge_ts?:string;
    hostname?:string;
    "error-codes"?:string[];
};

export async function verifyRecaptcha(token:string){
    const secret=process.env.RECAPTCHA_SECRET_KEY;

    if(!secret){
        throw new Error("RECAPTCHA_SECRET_KEY is not configured");
    }

    const body=new URLSearchParams({secret,response:token});

    const response=await fetch("https://www.google.com/recaptcha/api/siteverify",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:body.toString(),
        }
    );
    if(!response.ok){
        throw new Error("Failed to verify reCAPTCHA");
    }
    const result = (await response.json()) as RecaptchaResponse;
    if (!result.success) {
        console.error("reCAPTCHA verification failed:", result["error-codes"]);
    }
    return result.success;
}