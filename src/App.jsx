import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PlayNote from "./practices/playnote/PlayNote.jsx";
import PingPongMelodyContainer from "./practices/melody_training/PingPongMelodyContainer.jsx";
import PingPongHarmonyContainer from "./practices/harmony_training/PingPongHarmonyContainer.jsx";
import RealMelodyContainer from "./practices/real_melody_training/RealMelodyContainer.jsx";
import DegreeNoticeContainer from "./practices/degree_notice_training/DegreeNoticeContainer.jsx";
import ChordTypeContainer from "./practices/chord_type_practice/ChordTypeContainer.jsx";
import Keyboard from "./practices/keyboard/Keyboard.jsx";
import MusicalStaff from "./practices/MusicalStaff/MusicalStaff.jsx";
import LearnPianoContainer from "./practices/learn_piano/LearnPianoContainer.jsx";
import LearnPianoChordsContainer from "./practices/learn_piano_chords/LearnPianoChordsContainer.jsx"; // ✅ NEW

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayNote />} />
        <Route path="/melody" element={<PingPongMelodyContainer />} />
        <Route path="/harmony" element={<PingPongHarmonyContainer />} />
        <Route path="/real-melody" element={<RealMelodyContainer />} />
        <Route path="/degree-notice" element={<DegreeNoticeContainer />} />
        <Route path="/chord-type" element={<ChordTypeContainer />} />
        <Route path="/keyboard" element={<Keyboard />} />
        <Route path="/staff" element={<MusicalStaff />} />
        <Route path="/learn-piano" element={<LearnPianoContainer />} />
        <Route path="/learn-piano-chords" element={<LearnPianoChordsContainer />} /> {/* ✅ NEW */}
      </Routes>
    </Router>
  );
}

export default App;
