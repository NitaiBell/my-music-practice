import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home.jsx';
import NitaiPractices from './pages/NitaiPractices.jsx';
import CoursePage from './pages/course/CoursePage.jsx';
import FullViewPage from './pages/course/FullViewPage.jsx';

// Simple Practices
import PlayNote from './practices/playnote/PlayNote.jsx';
import Keyboard from './practices/keyboard/Keyboard.jsx';
import MusicalStaff from './practices/MusicalStaff/MusicalStaff.jsx';
import SingNote from './practices/sing_note/SingNote.jsx';

// Container Practices
import PingPongMelodyContainer from './practices/melody_training/PingPongMelodyContainer.jsx';
import PingPongHarmonyContainer from './practices/harmony_training/PingPongHarmonyContainer.jsx';
import RealMelodyContainer from './practices/real_melody_training/RealMelodyContainer.jsx';
import DegreeNoticeContainer from './practices/degree_notice_training/DegreeNoticeContainer.jsx';
import ChordTypeContainer from './practices/chord_type_practice/ChordTypeContainer.jsx';
import LearnPianoContainer from './practices/learn_piano/LearnPianoContainer.jsx';
import LearnPianoChordsContainer from './practices/learn_piano_chords/LearnPianoChordsContainer.jsx';
import IntervalPracticeContainer from './practices/interval_training/IntervalPracticeContainer.jsx';
import WhichHigherNoteContainer from './practices/which_higher_note/WhichHigherNoteContainer.jsx';
import DifferencePracticeContainer from './practices/difference_practice/DifferencePracticeContainer.jsx';
import WriteNotesPracticeContainer from './practices/write_notes_practice/WriteNotesPracticeContainer.jsx';
import ChordsForMelodyContainer from './practices/chords_for_melody/ChordsForMelodyContainer.jsx'; // ✅ NEW IMPORT

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/nitai-practices" element={<NitaiPractices />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/fullview/:courseId" element={<FullViewPage />} />

        {/* Simple Practices */}
        <Route path="/play" element={<PlayNote />} />
        <Route path="/keyboard" element={<Keyboard />} />
        <Route path="/staff" element={<MusicalStaff />} />
        <Route path="/sing-note" element={<SingNote />} />

        {/* Container Practices */}
        <Route path="/melody/*" element={<PingPongMelodyContainer />} />
        <Route path="/harmony/*" element={<PingPongHarmonyContainer />} />
        <Route path="/real-melody/*" element={<RealMelodyContainer />} />
        <Route path="/degree-notice/*" element={<DegreeNoticeContainer />} />
        <Route path="/chord-type/*" element={<ChordTypeContainer />} />
        <Route path="/learn-piano/*" element={<LearnPianoContainer />} />
        <Route path="/learn-piano-chords/*" element={<LearnPianoChordsContainer />} />
        <Route path="/interval-practice/*" element={<IntervalPracticeContainer />} />
        <Route path="/which-higher-note/*" element={<WhichHigherNoteContainer />} />
        <Route path="/difference/*" element={<DifferencePracticeContainer />} />
        <Route path="/write-notes/*" element={<WriteNotesPracticeContainer />} />
        <Route path="/chords-for-melody/*" element={<ChordsForMelodyContainer />} /> {/* ✅ NEW LINE */}
      </Routes>
    </Router>
  );
}
