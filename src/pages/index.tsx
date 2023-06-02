import Head from "next/head";
import { loginWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, signInWithGoogle } from "@/firebase/auth";
import { auth, db } from "../../firebase.config";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cookies } from "next/dist/client/components/headers";

export default function Home () {

  const [input, setInput] = useState({
    email: "", password: "", name: ""
  });
  const router = useRouter();
  const { oobCode } = router.query;

  const handleSignInWidthGoogle = async () => {
    const result = await signInWithGoogle(auth, db);
    alert(result.message)    
  }

  const handleEditData = (e: any) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const handleSignInWidthEmailAndPassword = async () => {
    const result = await registerWithEmailAndPassword(auth, db, input.name, input.email, input.password);
    alert(result.message); 
  }

  const handleSignUpWidthEmailAndPassword = async () => {
    const result = await loginWithEmailAndPassword(auth, input.email, input.password);
    alert(result.message);
  }

  const handleSendPasswordReset = async () => {
    const result = await sendPasswordReset(auth, db, input.email);
    alert(result.message)
  }

  useEffect(() => {
    console.log(oobCode);
  }, [])

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="this is the step_guide home page." />
      </Head>
      <main>
        <button className="w-[10rem] h-[3rem] m-[1rem] text-center text-roboto text-red hover:text-white border-solid border-gray-300 hover:border-gray-[500] hover:bg-slate-200 border-[1px]" onClick={handleSignInWidthGoogle}>
          Sigin in With Google
        </button>
        <div className="m-[1rem]">
          <input className="border-solid border-[1px] border-gray-300 m-[1rem] p-[0.5rem]" type="email" name="email" value={input.email} onChange={handleEditData} />
          <input className="border-solid border-[1px] border-gray-300 m-[1rem] p-[0.5rem]" type="text" name="password" value={input.password} onChange={handleEditData} />
          <input className="border-solid border-[1px] border-gray-300 m-[1rem] p-[0.5rem]" type="text" name="name" value={input.name} onChange={handleEditData} />
          <button className="w-[15rem] h-[3rem] m-[1rem] text-center text-roboto text-red hover:text-white border-solid border-gray-300 hover:border-gray-[500] hover:bg-slate-200 border-[1px]" onClick={handleSignInWidthEmailAndPassword}>
            Sigin Up With Email&Password
          </button>
          <button className="w-[15rem] h-[3rem] m-[1rem] text-center text-roboto text-red hover:text-white border-solid border-gray-300 hover:border-gray-[500] hover:bg-slate-200 border-[1px]" onClick={handleSignUpWidthEmailAndPassword}>
            Sigin In With Email&Password
          </button>
        </div>
        <button className="w-[15rem] h-[3rem] m-[1rem] text-center text-roboto text-red hover:text-white border-solid border-gray-300 hover:border-gray-[500] hover:bg-slate-200 border-[1px]" onClick={handleSendPasswordReset}>
          Send Password Reset
        </button>
      </main>
    </>
  )
}