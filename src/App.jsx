import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PlayNote from "./practices/playnote/PlayNote.jsx";
import PingPongMelodyContainer from "./practices/melody_training/PingPongMelodyContainer.jsx";
import Keyboard from "./practices/keyboard/Keyboard.jsx";
import MusicalStaff from "./practices/MusicalStaff/MusicalStaff.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayNote />} />
        <Route path="/melody" element={<PingPongMelodyContainer />} />
        <Route path="/keyboard" element={<Keyboard />} />
        <Route path="/staff" element={<MusicalStaff />} />
      </Routes>
    </Router>
  );
}

export default App;




