import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import PlayNote from "./practices/playnote/PlayNote.jsx";
import Keyboard from "./practices/keyboard/Keyboard.jsx";
import MusicalStaff from "./practices/MusicalStaff/MusicalStaff.jsx";
import SingNote from "./practices/sing_note/SingNote.jsx"; 
import NitaiPractices from "./pages/NitaiPractices.jsx"; 

// Containers
import PingPongMelodyContainer from "./practices/melody_training/PingPongMelodyContainer.jsx";
import PingPongHarmonyContainer from "./practices/harmony_training/PingPongHarmonyContainer.jsx";
import RealMelodyContainer from "./practices/real_melody_training/RealMelodyContainer.jsx";
import DegreeNoticeContainer from "./practices/degree_notice_training/DegreeNoticeContainer.jsx";
import ChordTypeContainer from "./practices/chord_type_practice/ChordTypeContainer.jsx";
import LearnPianoContainer from "./practices/learn_piano/LearnPianoContainer.jsx";
import LearnPianoChordsContainer from "./practices/learn_piano_chords/LearnPianoChordsContainer.jsx";
import IntervalPracticeContainer from "./practices/interval_training/IntervalPracticeContainer.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<PlayNote />} />
        <Route path="/keyboard" element={<Keyboard />} />
        <Route path="/staff" element={<MusicalStaff />} />
        <Route path="/sing-note" element={<SingNote />} />
        <Route path="/nitai-practices" element={<NitaiPractices />} />

        {/* Practices (Each practice handled by its container internally) */}
        <Route path="/melody/*" element={<PingPongMelodyContainer />} />
        <Route path="/harmony/*" element={<PingPongHarmonyContainer />} />
        <Route path="/real-melody/*" element={<RealMelodyContainer />} />
        <Route path="/degree-notice/*" element={<DegreeNoticeContainer />} />
        <Route path="/chord-type/*" element={<ChordTypeContainer />} />
        <Route path="/learn-piano/*" element={<LearnPianoContainer />} />
        <Route path="/learn-piano-chords/*" element={<LearnPianoChordsContainer />} />
        <Route path="/interval-practice/*" element={<IntervalPracticeContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
