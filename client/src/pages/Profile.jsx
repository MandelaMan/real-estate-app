import { useState ,useEffect, useRef} from "react"
import {  useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref,uploadBytesResumable } from "firebase/storage";
import {app} from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserFailure, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0)
  const [fileErrorUpload, setFileErrorUpload] = useState(false)

  const fileRef = useRef(null)
  
  const {currentUser, loading , error} = useSelector((state) => state.user)  
  const dispatch = useDispatch()

  const handleFileUpload = (file) =>{

    setFileErrorUpload(false)

    const MIN_FILE_SIZE = 1024 // 1MB
    const MAX_FILE_SIZE = 2024 // 5MB

    const fileSizeKiloBytes = file.size / 1024

    if(fileSizeKiloBytes > MIN_FILE_SIZE && fileSizeKiloBytes < MAX_FILE_SIZE){
      const storage = getStorage(app)

      const fileName = new Date().getTime() + file.name

      const storageRef = ref(storage, fileName)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          setFileUploadPercentage(Math.round(progress))
        }, 
        (error) => {

          setFileErrorUpload(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {  
            
            setFormData({
              ...formData,
            avatar: downloadURL
            })
          })
        }
      );  
    }
    else{
      setFileErrorUpload(true)
      return;
    }    
  }
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers : {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()

      if(data.success === false){            
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data.user))      
      setFormData({})
    }
    catch(err){
      dispatch(updateUserFailure(err.message))
      return
    }
  }

  const deleteUser = async () => {
    // currentUser.id

    try{
      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json()

      if(data.success === false){            
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(deleteUserSuccess(data))      
      setFormData({})
    }
    catch(err){
      dispatch(deleteUserFailure())
      return;
    }
  }

  const signOutUser = async () => {
    try{
      dispatch(signOutUserStart())

      const res = await fetch(`/api/auth/signout`, {
        method: 'GET',
      });

      const data = await res.json()

      if(data.success === false){            
        dispatch(signOutUserFailure(data.message))
        return;
      }

      dispatch(signOutUserSuccess(data))      
      setFormData({})
    }
    catch(err){
      dispatch(signOutUserFailure())
      return;
    }
  } 

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }  

    return () => {
      // second
    }
  }, [file])
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-5 mt-5">Profile</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} accept="image/*" hidden/>

        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <p className="text-sm self-center">
          {fileErrorUpload ? ( 
            <span className="text-red-700">Image is too large. Must be less that 2MB</span> 
            ) : fileUploadPercentage > 0 && fileUploadPercentage < 100 ? (
            <span className="text-slate-700">Upload progress {fileUploadPercentage}%</span>
            ) : fileUploadPercentage === 100 ? (
                <span className="text-green-700">Image successfully uploaded</span>
            ) : ""
          }
        </p>
        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" defaultValue={currentUser.username} onChange={handleChange}/>
        <input type="text" placeholder="email" id="email" className="border p-3 rounded-lg" defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" placeholder="Enter new password" id="password" className="border p-3 rounded-lg" onChange={handleChange}/>
        <button disabled={loading}  className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Update'}
        </button>  
        <Link to="/create-listing" className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
          Create Listing
        </Link>
      </form>
     
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={deleteUser}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={signOutUser}>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile