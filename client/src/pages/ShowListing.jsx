import { useState , useEffect} from "react"
import { useParams } from "react-router-dom"
import {Swiper, SwiperSlide} from "swiper/react"
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import default_home from "../assets/images/default-house.webp"
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaParking } from "react-icons/fa";
import { useSelector } from 'react-redux'
import ContactLandlord from '../components/ContactLandlord'

const ShowListing = () => {

    SwiperCore.use(Navigation)

    const params =  useParams()

    const{currentUser} = useSelector((state) => state.user)

    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const [listing, setListing] = useState()
    const [contact, setContact] = useState(false)

    const getListing = async (id) => {       
        try{
            setLoading(true)

            const res = await fetch(`/api/listing/get/${id}`, {
                method: 'GET',
            });

            const data = await res.json();

            if(data.success === false){ 
                setError(data.message)        
                return;
            }

            setListing(data.listing)
            setLoading(false)   
        }
        catch(err){
            setError(err.message)   
        }
    }

    useEffect(() => {

        if(params.id){
            getListing(params.id)
        }
    
        return () => {
            // second
        }
    }, [params.id])
    
    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">Loading ...</p>}
            {error && <p className="text-center my-7 text-2xl">Error fetching the listing ...</p>}
            {listing && !loading && !error && ( 
                <div>               
                    <Swiper navigation>
                        {listing.imageUrls.length > 0 ?
                        <>{listing.imageUrls.map((url, i) => <SwiperSlide key={i}>
                            <div className="h-[450px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'fit'}}></div>
                        </SwiperSlide>)}</> : 
                        <img src={default_home} alt=""/>}
                    </Swiper>                   
                    <div className="flex flex-col max-w-4xl mx-auto p-3 gap-2">
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${listing.regularPrice}
                        </p>
                        <p className='flex items-center mt-6 gap-1 text-slate-600 my-2 text-sm'>                          
                        <FaMapMarkedAlt className='text-green-700'/>  {listing.address}
                        </p>  
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === "rent" ? "For Rent" : "For Sale"}
                            </p>
                                {listing.offer && (<p>${+listing.regularPrice - +listing.discountedPrice}
                            </p>)}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>{listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg'/>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` :
                            `${listing.bedrooms} bed`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg'/>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` :
                            `${listing.bathrooms} bath`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg'/>{listing.parking ? `Parking` : `No Parking`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                            <FaChair className='text-lg'/>{listing.furnished ? `Furnished` : `Not Furnished`}
                            </li>
                        </ul>   
                        {contact && <ContactLandlord listing={listing} setContact={setContact}/>}
                        {currentUser && listing.useRef !== currentUser._id && !contact && 
                           <button onClick={() => setContact(true)} className='mt-2 mb-2 bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95'>
                              Contact Landlord                            
                           </button> 
                        }                                        
                    </div>                    
                </div>        
            )}
        </main>
    )
}

export default ShowListing