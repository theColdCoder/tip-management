import TipPage from "./pages/TipPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tip/:slug" element={<TipPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
