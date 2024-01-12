import { useState } from "react"
import { Link } from "react-router-dom"

const Signin = () => {

  const [formData, setFormData] = useState();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })

    console.log(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await res.json()

    console.log(res)
  }

  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>
      <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Sign in</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
    </div>
  )
}

export default Signin