import { Routes, Route} from "react-router-dom";
import Accueil from "./pages/Accueil";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Publications from "./pages/Profil";
import Profil from "./pages/Publications";

function App() {

  return (
    <div className="App">
     <Routes>
        <Route exact path="/" element={<Accueil />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route path="/publication" element={<Publications />}></Route>
        <Route path="/profil/:id" element={<Profil />}></Route>
        {/* <Route path="/organigramme" element={<Organigramme />}></Route> */}
        {/* <Route path="*" element={<Error />}></Route> */}
      </Routes>
    </div>
  )
}

export default App
