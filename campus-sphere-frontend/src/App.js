import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Deadlines from "./pages/Deadlines";
import LostFound from "./pages/LostFound";
import Expenses from "./pages/Expenses";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Options from "./pages/Options";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deadlines" element={<Deadlines />} />
        <Route path="/lostfound" element={<LostFound />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/options" element={<Options />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
