import { Route, Routes } from "react-router-dom"
import styles from './App.css';
import SignUp from "./pages/signup/Signup.jsx";
import Fav from "./pages/Fav/FavPage.jsx";
import Login from "./pages/login/login.jsx";
import Profile from "./pages/Profile/ProfilePage";
import Home from "./pages/homePage/Home.jsx";
import ArabHome from "./pages/ArabHomePage/ArabHomePage.jsx";
import VeracityPage from "./pages/NewsVaricity/NewsVeracityHandle.jsx"
import AboutUsPage from "./pages/aboutus/AboutUs.jsx"
import History  from "./pages/History/History.jsx"
import DeepfakePage from "./pages/DeepFake/DeepFakeHandle.jsx";
import SearchPage from "./components/SearchBar/SearchPage.jsx"


function App() {
  return (
    <div className={styles.App}>
     <Routes>
        <Route path="/" element= {<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/fav" element= {<Fav />} />
        <Route path="/History" element= {<History />} />
        <Route path="/AboutUsPage" element= {<AboutUsPage />} />
        <Route path="/VeracityPage" element= {<VeracityPage />} />
        <Route path="/Deepfake" element= {<DeepfakePage />} />
        <Route path='/ArabHomePage' element={<ArabHome/>}/>
        <Route path="/SearchPage" element={<SearchPage />} />

     </Routes>
    </div>
  );
}

export default App;
