import { Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import Collection from "./pages/Collection";
import Users from "./pages/Users";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import { Toaster } from "sonner"
  

function App() {
  return (
  
  <div>
    <Toaster />
    <Routes>
      <Route path="/" element={<Books />} />
      <Route path="/books" element={<Books />} />
      <Route path="/collection/:userId" element={<Collection />} />
      <Route path="/users" element={<Users />} />
      <Route path="/login" element={<LogIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </div>
     
  );
}

export default App;
