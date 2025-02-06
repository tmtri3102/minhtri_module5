import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddOrder from "./components/AddOrder";

function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddOrder />} />
          </Routes>
        </BrowserRouter>
  );
}
export default App;