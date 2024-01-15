import { useState ,useEffect, useRef} from "react"
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref,uploadBytesResumable } from "firebase/storage";

import {app} from '../firebase'

const Profile = () => {
  
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0)
  const [fileErrorUpload, setFileErrorUpload] = useState(false)

  const fileRef = useRef(null)
  
  const {currentUser} = useSelector((state) => state.user)

  const handleFileUpload = (file) =>{
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
          setFormData({...formData, avatar: downloadURL})
        })
      }
    );   
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
      <form className="flex flex-col gap-4" autoComplete="off">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} accept="image/*" hidden/>

        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <p className="text-sm self-center">
          {fileErrorUpload ? ( 
            <span className="text-red-700">Image is too large. Must be less that 2MB</span> 
            ) : fileUploadPercentage > 0 && fileUploadPercentage < 100 ? (
            <span className="text-slate-700">Uplad progress {fileUploadPercentage}%</span>
            ) : fileUploadPercentage === 100 ? (
                <span className="text-green-700">Image successfully uploaded</span>
            ) : ""
          }
        </p>
        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" />
        <input type="text" placeholder="email" id="email" className="border p-3 rounded-lg" />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />
        <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>      
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile