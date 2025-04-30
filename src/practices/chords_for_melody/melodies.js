// src/practices/chords_for_melody/melodies.js

export const melodies = {
  simpleMelody: {
    tempo: 50,
    notes: [
      { note: "C4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "G4", duration: 2 },
      { note: "C4", duration: 4 },
    ],
  },

  risingMelody: {
    tempo: 60,
    notes: [
      { note: "C4", duration: 2 },
      { note: "D4", duration: 2 },
      { note: "E4", duration: 2 },
      { note: "F4", duration: 2 },
      { note: "G4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "B4", duration: 1 },
      { note: "C5", duration: 1 },
      { note: "E4", duration: 2 },
      { note: "C4", duration: 2 },
    ],
  },

  waltzMelody: {
    tempo: 90,
    timeSignature: [3, 4],
    notes: [
      { note: "C4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "G4", duration: 1 },

      { note: "F4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "C5", duration: 1 },

      { note: "G4", duration: 1.5 },
      { note: "F4", duration: 1.5 },

      { note: "E4", duration: 3 },
    ],
  },

  sadInThree: {
    tempo: 72,
    timeSignature: [3, 4],
    notes: [
      { note: "A4", duration: 1.5 },
      { note: "G#4", duration: 0.5 },
      { note: "A4", duration: 1 },

      { note: "B4", duration: 2 },
      { note: "E4", duration: 1 },

      { note: "C5", duration: 1.5 },
      { note: "B4", duration: 0.5 },
      { note: "C5", duration: 1},

      { note: "D5", duration: 1 },
      { note: "C5", duration: 1 },
      { note: "B4", duration: 1 },

      { note: "B4", duration: 1.5 },
      { note: "C5", duration: 0.5 },
      { note: "D5", duration: 1 },

      { note: "E5", duration: 1.5 },
      { note: "B4", duration: 1.5 },

      { note: "A4", duration: 3 },

    ],
  },




  playfulMelody: {
    tempo: 140,
    notes: [
      { note: "G4", duration: 0.5 },
      { note: "E4", duration: 0.5 },
      { note: "F4", duration: 0.5 },
      { note: "D4", duration: 0.5 },
      { note: "G4", duration: 0.5 },
      { note: "F4", duration: 0.5 },
      { note: "E4", duration: 0.5 },
      { note: "C4", duration: 0.5 },

      { note: "D4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "G4", duration: 1 },

      { note: "F4", duration: 0.5 },
      { note: "G4", duration: 0.5 },
      { note: "A4", duration: 3 },

      { note: "C5", duration: 4 },

      { note: "G4", duration: 0.5 },
      { note: "G4", duration: 0.5 },
      { note: "G4", duration: 0.5 },
      { note: "G4", duration: 0.5 },
      { note: "E4", duration: 0.5 },
      { note: "F4", duration: 0.5 },
      { note: "G4", duration: 0.5 },
      { note: "C4", duration: 0.5 },

      { note: "D4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "G4", duration: 1 },

      { note: "E4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "G4", duration: 2 },

      { note: "C5", duration: 4 },
    ],
  },
};
