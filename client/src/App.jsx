import { BrowserRouter , Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignOut from "./pages/SignOut";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./PrivateRoute";
import SignIn from "./pages/Signin";
import CreateListing from "./pages/CreateListing";
import AllListings from "./pages/AllListings";
import UpdateListing from "./pages/UpdateListing";

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/sign-in" element={<SignIn />}/>
      <Route path="/signout" element={<SignOut />}/>
      <Route path="/listings/:id" element={<AllListings />}/>
      <Route element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/create-listing" element={<CreateListing />}/>
        <Route path="/update-listing/:id" element={<UpdateListing />}/>
      </Route>
      <Route path="/about" element={<About />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
