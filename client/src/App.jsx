import { BrowserRouter , Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignOut from "./pages/SignOut";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Signin from "./pages/Signin";

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/sign-up" element={<SignUp />}/>
      <Route path="/sign-in" element={<Signin />}/>
      <Route path="/signout" element={<SignOut />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/about" element={<About />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
