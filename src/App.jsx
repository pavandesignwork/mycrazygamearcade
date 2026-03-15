import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingHeader from "./components/FloatingHeader";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <>
              <FloatingHeader />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GamePage />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
