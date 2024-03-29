import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure  } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {

  const dispatch = useDispatch()

  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{

      dispatch(signInStart())

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()

      if(data.success === false){    
        
        dispatch(signInFailure(data.message))
        return;
      }

      dispatch(signInSuccess(data))      
      setFormData({})
      navigate('/')
    }
    catch(err){             
      dispatch(signInFailure(err.message))
    }
  }

  return (
    <div className="p-3 max-w-md mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
        <input type="text" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange}/>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading ...' : 'Sign in'}
        </button>
        <OAuth/>
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

export default SignIn