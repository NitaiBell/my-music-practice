import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PlayNote from "./practices/playnote/PlayNote.jsx";
import PingPongMelodyContainer from "./practices/melody_training/PingPongMelodyContainer.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayNote />} />
        <Route path="/melody" element={<PingPongMelodyContainer />} />
      </Routes>
    </Router>
  );
}

export default App;




