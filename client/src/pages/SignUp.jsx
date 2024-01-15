import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const SignUp = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      setLoading(true)

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()

      if(data.success === false){      
        setLoading(false)
        setError(data.message)
        return;
      }
      setLoading(false)      
      setFormData({})
      setError(null)

      navigate('/sign-in')
    }
    catch(err){     
        setLoading(false)  
        setError(err.message)
    }
  }

  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign Up
      </h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" onChange={handleChange}/>
        <input type="text" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Sign up'}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Already have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp