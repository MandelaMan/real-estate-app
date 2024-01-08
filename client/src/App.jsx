import { BrowserRouter , Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignOut from "./pages/SignOut";
import Signin from "./pages/Signin";


const App = () => {
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/signin" element={<Signin />}/>
      <Route path="/signout" element={<SignOut />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/about" element={<About />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
