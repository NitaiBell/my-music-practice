import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// ✅ Main Pages
import Home from './pages/Home.jsx';
import NitaiPractices from './pages/NitaiPractices.jsx';
import CoursePage from './pages/course/CoursePage.jsx';
import FullViewPage from './pages/course/FullViewPage.jsx';
import UserProfile from './pages/userprofile/UserProfile.jsx';
import PracticesShowcase from './pages/practices/PracticesShowcase.jsx';
import PracticeLog from './pages/practicelog/PracticeLog.jsx';
import About from './pages/about/About.jsx';
import InstructionPractice from './pages/practices/InstructionPractice.jsx';

// ✅ Auth Pages
import SignIn from './pages/auth/SignIn.jsx';
import SignUp from './pages/auth/SignUp.jsx';

// ✅ Article Pages
import ArticlesList from './pages/articles/ArticlesList.jsx';
import ArticlePage from './pages/articles/ArticlePage.jsx';

// ✅ Simple Practices
import PlayNote from './practices/playnote/PlayNote.jsx';
import KeyboardDemo from './practices/keyboard/KeyboardDemo';
import MusicalStaff from './practices/MusicalStaff/MusicalStaff.jsx';
import SingNote from './practices/sing_note/SingNote.jsx';

// ✅ Container Practices
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
import ChordsForMelodyContainer from './practices/chords_for_melody/ChordsForMelodyContainer.jsx';
import SpecialChordPracticeContainer from './practices/special_chord_practice/SpecialChordPracticeContainer.jsx';
import MelodicDictationContainer from './practices/melodic_dictation/MelodicDictationContainer.jsx';
import HarmonicDictationContainer from './practices/harmonic_dictation/HarmonicDictationContainer.jsx';
import ListOfValidProgressions from './practices/harmonic_dictation/ListOfValidProgressions.jsx';

// ✅ School Pages
import School from './pages/school/School.jsx';
import StudentLog from './pages/school/StudentLog.jsx';

// ✅ Courses
import AllCoursesPage from './pages/courses/AllCoursesPage/AllCoursesPage.jsx';
import WelcomeKeyboardCoursePage from './pages/courses/welcome-keyboard/WelcomeKeyboardCoursePage.jsx';
import FunctionalHarmonyCoursePage from './pages/courses/functional-harmony/FunctionalHarmonyCoursePage.jsx';
import PingPongCoursePage from './pages/courses/ping-pong-melody/PingPongCoursePage.jsx';
import PingPongHarmonyCoursePage from './pages/courses/pingpong-harmony/PingPongHarmonyCoursePage.jsx';


// 🧠 Global Hotkey Listener – יעבוד בכל האתר
function GlobalHotkeyListener() {
  const location = useLocation();

  useEffect(() => {
    const handleFeedbackClick = () => {
      const subject = encodeURIComponent("Feedback for LikeMozart");
      const body = encodeURIComponent(
        `Page: ${window.location.origin}${location.pathname}\n\nYour feedback here: `
      );
      const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=mozartmozart@gmail.com&su=${subject}&body=${body}`;
      window.open(mailtoLink, "_blank");
    };

    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleFeedbackClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location]);

  return null; // אין UI
}


export default function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      {/* ✅ מאזין גלובלי — עובד בכל העמודים */}
      <GlobalHotkeyListener />

      <Routes>
        {/* 🏠 Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/nitai-practices" element={<NitaiPractices />} />
        <Route path="/course/:courseId" element={<CoursePage />} />
        <Route path="/fullview/:courseId" element={<FullViewPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/practices-showcase" element={<PracticesShowcase />} />
        <Route path="/instructions/:practiceKey" element={<InstructionPractice />} />
        <Route path="/practice-log/:practiceName" element={<PracticeLog />} />

        {/* 🔐 Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ℹ️ About */}
        <Route path="/about" element={<About />} />

        {/* 📰 Articles */}
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />

        {/* 🎹 Simple Practices */}
        <Route path="/play" element={<PlayNote />} />
        <Route path="/keyboard" element={<KeyboardDemo />} />
        <Route path="/staff" element={<MusicalStaff />} />
        <Route path="/sing-note" element={<SingNote />} />

        {/* 🎵 Container Practices */}
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
        <Route path="/chords-for-melody/*" element={<ChordsForMelodyContainer />} />
        <Route path="/special_chord/*" element={<SpecialChordPracticeContainer />} />
        <Route path="/melodic-dictation/*" element={<MelodicDictationContainer />} />
        <Route path="/harmonic/*" element={<HarmonicDictationContainer />} />
        <Route path="/harmonic/progressions" element={<ListOfValidProgressions />} />

        {/* 🏫 School System */}
        <Route path="/school" element={<School currentUser={currentUser} />} />
        <Route path="/school/log/:studentEmail" element={<StudentLog currentUser={currentUser} />} />

        {/* 📚 Courses */}
        <Route path="/courses" element={<AllCoursesPage />} />
        <Route path="/courses/welcome-keyboard" element={<WelcomeKeyboardCoursePage />} />
        <Route path="/courses/functional-harmony" element={<FunctionalHarmonyCoursePage />} />
        <Route path="/courses/pingpong-melody" element={<PingPongCoursePage />} />
        <Route path="/courses/pingpong-harmony" element={<PingPongHarmonyCoursePage />} />
      </Routes>
    </Router>
  );
}
