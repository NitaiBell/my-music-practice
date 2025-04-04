import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PlayNote from "./practices/playnote/PlayNote.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayNote />} />
      </Routes>
    </Router>
  );
}

export default App;


