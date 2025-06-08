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
    chords: ['C', 'F', 'G', 'Am'],
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
    chords: ['C', 'Dm', 'F', 'G'],
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
    chords: ['C', 'F', 'G', 'Am'],
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
      { note: "C5", duration: 1 },
      { note: "D5", duration: 1 },
      { note: "C5", duration: 1 },
      { note: "B4", duration: 1 },
      { note: "B4", duration: 1.5 },
      { note: "C5", duration: 0.5 },
      { note: "D5", duration: 1 },
      { note: "E5", duration: 1.5 },
      { harmonynote: "B4", duration: 1.5 },
      { note: "A4", duration: 3 },
    ],
    chords: ['Am', 'Dm', 'E', 'F'],
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
    chords: ['G', 'C', 'D', 'Em'],
  },

  mysticWanderer: {
    tempo: 70,
    notes: [
      { note: "A4", duration: 1.5 },
      { note: "G4", duration: 0.5 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "C4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "C5", duration: 1.5 },
      { note: "B4", duration: 0.5 },
      { note: "A4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "A3", duration: 2 },
    ],
    chords: ['Am', 'F', 'G', 'C'],
  },

  twinkleTwinkle: {
    tempo: 100,
    notes: [
      { note: "C4", duration: 1 },
      { note: "C4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "G4", duration: 2 },
      { note: "F4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "C4", duration: 2 },
      { note: "G4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "D4", duration: 2 },
      { note: "G4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "D4", duration: 2 },
      { note: "C4", duration: 1 },
      { note: "C4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "G4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "G4", duration: 2 },
      { note: "F4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "C4", duration: 2 },
    ],
    chords: ['C', 'F', 'G'],
  },

  happyBirthday: {
    tempo: 120,
    timeSignature: [3, 4],
    notes: [
      // Phrase 1: "Happy birthday to you"

      { note: "A3", duration: 1 },
      { note: "G3", duration: 1 },
      { note: "C4", duration: 1 },
      { note: "B3", duration: 2 },
      // Phrase 2: "Happy birthday to you"
      { note: "G3", duration: 0.5 },
      { note: "G3", duration: 0.5 },
      { note: "A3", duration: 1 },
      { note: "G3", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "C4", duration: 2 },
      // Phrase 3: "Happy birthday dear friend"
      { note: "G3", duration: 0.5 },
      { note: "G3", duration: 0.5 },
      { note: "G4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "C4", duration: 1 },
      { note: "B3", duration: 1 },
      { note: "A3", duration: 1 },
      // Phrase 4: "Happy birthday to you"
      { note: "F4", duration: 0.5 },
      { note: "F4", duration: 0.5 },
      { note: "E4", duration: 1 },
      { note: "C4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "C4", duration: 2 },
    ],
    chords: ['C', 'F', 'G'],
  },

  melodyWithCandG1: {
    tempo: 120,
    timeSignature: [3, 4],
    notes: [
      // Phrase 1: "Happy birthday to you"
      { note: "C4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "E4", duration: 1 },

      { note: "D4", duration: 2 },
      { note: "B3", duration: 1 },

      { note: "C4", duration: 1 },
      { note: "D4", duration: 1 },
      { note: "E4", duration: 1 },

      { note: "G4", duration: 3 },
    ],
    chords: ['C', 'G'],
  },


  melodyWithCandG2: {
    tempo: 120,
    timeSignature: [3, 4],
    notes: [
      // Phrase 1: "Happy birthday to you"
      { note: "G4", duration: 1 },
      { note: "E4", duration: 1 },
      { note: "F4", duration: 1 },

      { note: "G4", duration: 2 },
      { note: "B4", duration: 1 },

      { note: "G4", duration: 1 },
      { note: "F4", duration: 1 },
      { note: "E4", duration: 1 },

      { note: "D4", duration: 3 },
    ],
    chords: ['C', 'G'],



    
  },


  melodyWithCandG3: {
    tempo: 120,
    timeSignature: [3, 4],
    notes: [
      // Phrase 1: "Happy birthday to you"
      { note: "B4", duration: 1 },
      { note: "A4", duration: 1 },
      { note: "G4", duration: 1 },

      { note: "C5", duration: 1 },
      { note: "B4", duration: 1 },
      { note: "A4", duration: 1 },


      { note: "B4", duration: 1 },
      { note: "B4", duration: 1 },
      { note: "G4", duration: 1 },

      { note: "C4", duration: 3 },
    ],
    chords: ['C', 'G'],



    
  },
  



  


  


};