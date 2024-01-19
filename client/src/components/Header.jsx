import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState,useEffect } from 'react'

const Header = () => {
  const [search, setSearch] = useState("")

  const navigate = useNavigate()

  const handleSubmit =(e) => {
    e.preventDefault()

    //inorder to change the search term to whatever you are searching for currently
    const urlParams = new URLSearchParams(window.location.search)

    urlParams.set('search',search)

    const searchQuery = urlParams.toString()

    navigate(`/q?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const setSearchUrl = urlParams.get('search')

    if(setSearchUrl){
      setSearch(setSearchUrl)
    }  
    return () => {
      // second

      setSearch("")
    }
  }, [location.search])
  

  const {currentUser} = useSelector((state) => state.user)

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>My</span>
            <span className='text-slate-700'>App</span>
          </h1>
        </Link>
        <form className='bg-slate-100 p-3 roundend-lg flex items-center' onSubmit={handleSubmit}>
          <input type="text"
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search...' 
          value={search}
          className='bg-transparent focus:outline-none w-24 sm:w-64'/>
          <button><FaSearch className='text-slate-600'/></button>
        </form>
        <ul className='flex gap-4'>
          <Link to="/">
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to="/about">
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
           <Link to={currentUser ? "/profile" : "/sign-in"}>
            {currentUser ? 
              <>
                <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile" />          
              </> 
            :          
              <li className='hidden sm:inline text-slate-700 hover:underline'>
                Signin
              </li>          
            }
           </Link>
        </ul>
      </div>
    </header>
  )
}

export default Header