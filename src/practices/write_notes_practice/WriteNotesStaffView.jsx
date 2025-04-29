// src/practices/write_notes_practice/WriteNotesStaffView.jsx

import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import './WriteNotesStaffView.css';

const WriteNotesStaffView = ({ onNoteSelected }) => {
  const containerRef = useRef(null);
  const [selectedNote, setSelectedNote] = useState('');

  useEffect(() => {
    const SCALE = 2;
    const div = containerRef.current;
    div.innerHTML = '';

    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(div.clientWidth || 1600, div.clientHeight || 600);
    const context = renderer.getContext();
    context.scale(SCALE, SCALE);

    const stave = new Stave(25, 25, 700);
    stave.addClef('treble').setContext(context).draw();

    const drawNoteOnStave = (note) => {
      const previousLayer = div.querySelector('.vf-note-layer');
      if (previousLayer) {
        previousLayer.remove();
      }

      const staveNote = new StaveNote({
        clef: 'treble',
        keys: [note],
        duration: 'q', // use 'h' for half notes if preferred
      });

      if (note.includes('#')) {
        staveNote.addAccidental(0, new Accidental('#'));
      }
      if (note.includes('b')) {
        staveNote.addAccidental(0, new Accidental('b'));
      }

      const voice = new Voice({ num_beats: 1, beat_value: 4 });
      voice.setStrict(false);
      voice.addTickables([staveNote]);

      new Formatter().joinVoices([voice]).format([voice], 600);

      const noteGroup = context.openGroup();
      noteGroup.classList.add('vf-note-layer');
      voice.draw(context, stave);
      context.closeGroup();
    };

    const getNoteFromYCoordinate = (y) => {
      const tempStave = new Stave(25, 25, 700);
      const staffLines = [
        { note: 'a/5', y: tempStave.getYForLine(-1.5) },
        { note: 'g/5', y: tempStave.getYForLine(-1) },
        { note: 'f/5', y: tempStave.getYForLine(0) },
        { note: 'e/5', y: tempStave.getYForLine(0) + 5 },
        { note: 'd/5', y: tempStave.getYForLine(1) },
        { note: 'c/5', y: tempStave.getYForLine(1) + 5 },
        { note: 'b/4', y: tempStave.getYForLine(2) },
        { note: 'a/4', y: tempStave.getYForLine(2) + 5 },
        { note: 'g/4', y: tempStave.getYForLine(3) },
        { note: 'f/4', y: tempStave.getYForLine(3) + 5 },
        { note: 'e/4', y: tempStave.getYForLine(4) },
        { note: 'd/4', y: tempStave.getYForLine(4) + 5 },
        { note: 'c/4', y: tempStave.getYForLine(5) },
        { note: 'b/3', y: tempStave.getYForLine(5) + 5 },
        { note: 'a/3', y: tempStave.getYForLine(6) },
      ];

      let closest = staffLines[0];
      let minDiff = Math.abs(y - closest.y);

      for (let i = 1; i < staffLines.length; i++) {
        const diff = Math.abs(y - staffLines[i].y);
        if (diff < minDiff) {
          closest = staffLines[i];
          minDiff = diff;
        }
      }

      return closest.note;
    };

    const handleClick = (event) => {
      const rect = div.getBoundingClientRect();
      const y = (event.clientY - rect.top) / SCALE;
      const note = getNoteFromYCoordinate(y);
      setSelectedNote(note);
      drawNoteOnStave(note);
      if (onNoteSelected) {
        onNoteSelected(note);
      }
    };

    div.addEventListener('click', handleClick);
    return () => {
      div.removeEventListener('click', handleClick);
    };
  }, [onNoteSelected]);

  return (
    <div className="write_notes_staff_view-container">
      {selectedNote && (
        <div className="write_notes_staff_view-selected-note">
          Selected Note: {selectedNote.toUpperCase().replace('/', '')}
        </div>
      )}
      <div ref={containerRef} className="write_notes_staff_view-staff"></div>
    </div>
  );
};

export default WriteNotesStaffView;
