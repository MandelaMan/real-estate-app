import { useState } from "react"
import { getDownloadURL, getStorage, ref,uploadBytesResumable } from "firebase/storage";
import {app} from '../firebase'

const CreateListing = () => {

  const [files, setFiles] = useState([]);

  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    imageUrls : []
  })

  const [imageUploadError, setImageUploadError] = useState();
  
  const handleImageSubmission = () => {

    if(files.length > 0 && files.length < 7 + formData.imageUrls.length < 7){

        setUploading(true)
        setImageUploadError(false)

        const promises = []

        for(let i=0; i<files.length; i++){
            promises.push(storeImage(files[i]));
        }

        Promise.all(promises).then((urls)=>{
            setFormData({...formData, imageUrls: formData.imageUrls.concat(urls) })

            setImageUploadError(false);

            setUploading(false)

            setFiles([])
        }).catch((error) =>{
            setImageUploadError("Ensure all images are less than 2MB" + error);
        })
    }else{
        setImageUploadError("You can only upload 6 images or less");
         setUploading(false)
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)

      const fileName = new Date().getTime() + file.name

      const storageRef = ref(storage, fileName)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          console.log(progress)
        }, 
        (error) => {
           reject(error)
        },
         () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {           
            resolve(downloadURL)
          })
        }
      );  
    })
  }

  const removeImage = (index) => {
    setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index )
    })
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
            Create Listing
        </h1>
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
            <input type="text" placeholder="name" className="border p-3 rounded-lg" id="name" maxLength="30" required/>
            <textarea type="text" placeholder="description" className="border p-3 rounded-lg" id="description"  maxLength="30" required/>
            <input type="text" placeholder="address" className="border p-3 rounded-lg" id="address" />

            <div className="flex gap-6 flex-wrap px-3">
                <div className="flex gap-2">
                    <input type="checkbox" id="sale" className="w-4 h-4 cursor-pointer" />
                    <span className="-mt-1">Sell</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="rent" className="w-4 h-4 cursor-pointer" />
                    <span className="-mt-1">Rent</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="parking" className="w-4 h-4 cursor-pointer" />
                    <span className="-mt-1">Parking</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="furnished" className="w-4 h-4" />
                    <span className="-mt-1">Furnished</span>
                </div>
                <div className="flex gap-2">
                    <input type="checkbox" id="offer" className="w-4 h-4 cursor-pointer" />
                    <span className="-mt-1">On Offer</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-2">
                    <input type="number" id="bedrooms" min={1} max={15} className="p-2 border-gray-300 rounded-lg"/>
                    <span>Beds</span>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id="bathrooms"  min={1} max={15} className="p-2 border-gray-300 rounded-lg"/>
                    <span>Baths</span>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id="regulardPrice" className="p-2 border-gray-300 rounded"/>
                    <div className="flex flex-col items-center">
                        <p>Regular Price</p>   
                        <span className="text-xs">($ / month)</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input type="number" id="discountedPrice" className="p-2 border-gray-300 rounded"/>
                    <div className="flex flex-col items-center">
                        <p>Discounted Price</p>   
                        <span className="text-xs">($ / month)</span>
                    </div>
                </div>
            </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">Images : 
                   <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} className="p-3 border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
                    <button type="button" 
                    onClick={handleImageSubmission}
                     className="p-3 text-green-700 border border-green rounded uppercase hover:shadow-lg disabled:opacity-80" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload' }
                    </button>
                </div>                
                <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                {formData.imageUrls.length > 0 && formData.imageUrls.map((url,i) =>
                    <div className="flex justify-between py-1 px-2 border items-center" key={url}>
                       <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                       <button onClick={() => removeImage(i)} className="p-3 text-red-700 rounded-lg uppercase ">Delete</button>
                    </div>
                )}
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-80 disabled:opacity-95">
                    Create Listing
                </button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing