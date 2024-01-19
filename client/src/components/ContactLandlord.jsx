import { useState ,useEffect} from "react"
import { FaWindowClose } from "react-icons/fa";
import { Link } from "react-router-dom";

const ContactLandlord = ({listing, setContact}) => {

    const [loading, setLoading] = useState(false)
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState();

    const handleOnChange = (e) => {
        setMessage(e.target.value)
    }   

    useEffect(() => {
        const getLandLordDetails = async () => {
            try{   
                setLoading(true)           

                const res = await fetch(`/api/user/${listing.userRef}`, {
                    method: 'GET',
                });

                const data = await res.json();

                if(data.success === false){ 
                    // setError(data.message)        
                    return;
                }
                
                setLandlord(data.remaining) 

                setLoading(false)
            }
            catch(err){
                // setError(err.message)   
            }
        }

        getLandLordDetails()
    
        return () => {
            // second
        }
    }, [listing.userRef])
    
  return (

    <div className="flex flex-col gap-2 mt-5">       
        {loading && <>Loading</>}
        {!loading && landlord && 
        <>
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <p>Write a message to <span>{landlord.username}</span> for <span>{listing.name}</span></p>
                <button onClick={() => setContact(false)} className="text-red-700 cursor-pointer flex flex-row">close</button>
            </div>
            <textarea name="message" id="message" rows="2" value={message} onChange={handleOnChange} className="w-full border p-3 rounded-lg" >
            </textarea>
            <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body${message}`} 
            className="bg-slate-700 text-white text-center p-2 uppercase rounded-lg hover:opacity-95">
            Send Message
            </Link>
        </div></>
        }
    </div>
  )
}

export default ContactLandlord