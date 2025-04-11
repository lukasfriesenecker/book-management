import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import Collection from "./pages/Collection";
import Users from "./pages/Users";
  

function App() {
  return (
  
  <div>
    <Navbar userId={1} username="John Doe" />
    <Routes>
      <Route path="/" element={<Books />} />
      <Route path="/books" element={<Books />} />
      <Route path="/collection/:userId" element={<Collection />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  </div>
     
  );
}

export default App;
