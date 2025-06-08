// src/data/HarmonyTrainingData.js

export const majorScales = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const scaleChordsMap = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim'],
  D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim'],
  E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim'],
  F: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim'],
  A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim'],
  B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim'],
};

// Functional chords with labels
export const chordFunctionsByScale = {
  C: {
    sharpIII: 'E',
    V7_vi: 'E7',
    V7_ii: 'A7',
    iv: 'Fm',
    flatIII: 'Eb',
    chromaticMediant: 'Abm',
    flatVII: 'Bb',
    V_iii: 'B',
    V_V: 'D',
    V7_V: 'D7',
    flatVI: 'Ab',
    neapolitan: 'Db',
    V7_iii: 'B7',
    V7_iv: 'C7',
    ii_vi: 'Bm',
    v: 'Gm',
    V7: 'C7',
    IV7: 'F7',
  },
  D: {
    sharpIII: 'F#',
    V7_vi: 'F#7',
    V7_ii: 'B7',
    iv: 'Gm',
    flatIII: 'F',
    chromaticMediant: 'Bbm',
    flatVII: 'C',
    V_iii: 'C#',
    V_V: 'E',
    V7_V: 'E7',
    flatVI: 'Bb',
    neapolitan: 'Eb',
    V7_iii: 'C#7',
    V7_iv: 'D7',
    ii_vi: 'C#m',
    v: 'Am',
    V7: 'D7',
    IV7: 'G7',
  },
  E: {
    sharpIII: 'G#',
    V7_vi: 'G#7',
    V7_ii: 'C#7',
    iv: 'Am',
    flatIII: 'G',
    chromaticMediant: 'Cm',
    flatVII: 'D',
    V_iii: 'D#',
    V_V: 'F#',
    V7_V: 'F#7',
    flatVI: 'C',
    neapolitan: 'F',
    V7_iii: 'D#7',
    V7_iv: 'E7',
    ii_vi: 'D#m',
    v: 'Bm',
    V7: 'E7',
    IV7: 'A7',
  },
  F: {
    sharpIII: 'A',
    V7_vi: 'A7',
    V7_ii: 'D7',
    iv: 'Bbm',
    flatIII: 'Ab',
    chromaticMediant: 'Dbm',
    flatVII: 'Eb',
    V_iii: 'E',
    V_V: 'G',
    V7_V: 'G7',
    flatVI: 'Db',
    neapolitan: 'Gb',
    V7_iii: 'E7',
    V7_iv: 'F7',
    ii_vi: 'Ebm',
    v: 'Cm',
    V7: 'F7',
    IV7: 'Bb7',
  },
  G: {
    sharpIII: 'B',
    V7_vi: 'B7',
    V7_ii: 'E7',
    iv: 'Cm',
    flatIII: 'Bb',
    chromaticMediant: 'Ebm',
    flatVII: 'F',
    V_iii: 'F#',
    V_V: 'A',
    V7_V: 'A7',
    flatVI: 'Eb',
    neapolitan: 'Ab',
    V7_iii: 'F#7',
    V7_iv: 'G7',
    ii_vi: 'F#m',
    v: 'Dm',
    V7: 'G7',
    IV7: 'C7',
  },
  A: {
    sharpIII: 'C#',
    V7_vi: 'C#7',
    V7_ii: 'F#7',
    iv: 'Dm',
    flatIII: 'C',
    chromaticMediant: 'Fm',
    flatVII: 'G',
    V_iii: 'G#',
    V_V: 'B',
    V7_V: 'B7',
    flatVI: 'F',
    neapolitan: 'Bb',
    V7_iii: 'G#7',
    V7_iv: 'A7',
    ii_vi: 'G#m',
    v: 'Em',
    V7: 'A7',
    IV7: 'D7',
  },
  B: {
    sharpIII: 'D#',
    V7_vi: 'D#7',
    V7_ii: 'G#7',
    iv: 'Em',
    flatIII: 'D',
    chromaticMediant: 'Gm',
    flatVII: 'A',
    V_iii: 'A#',
    V_V: 'C#',
    V7_V: 'C#7',
    flatVI: 'G',
    neapolitan: 'C',
    V7_iii: 'A#7',
    V7_iv: 'B7',
    ii_vi: 'A#m',
    v: 'F#m',
    V7: 'B7',
    IV7: 'E7',
  },
};

// 🎵 Label map: "♯III (E)" → "E"
export const chordDisplayMap = Object.entries(chordFunctionsByScale).reduce(
  (map, [scale, functions]) => {
    for (const [func, chord] of Object.entries(functions)) {
      const label = `${func.replace(/_/g, '/')} (${chord})`;
      map[label] = chord;
    }
    return map;
  },
  {}
);

// 🎹 Chord labels for display only
export const specialChordsByScale = Object.fromEntries(
  Object.entries(chordFunctionsByScale).map(([scale, funcs]) => [
    scale,
    Object.entries(funcs).map(
      ([func, chord]) => `${func.replace(/_/g, '/')} (${chord})`
    ),
  ])
);

// ✅ Chord values for logic/playback
export const extraChordsByScale = Object.fromEntries(
  Object.entries(chordFunctionsByScale).map(([scale, funcs]) => [
    scale,
    Object.values(funcs),
  ])
);
// Final note map (same as your provided version)
export const chordNoteMap = {
  // Triads
  'C': ['C3', 'E3', 'G3'], 'C#': ['Cs3', 'F3', 'Gs3'], 'D': ['D3', 'Fs3', 'A3'], 'D#': ['Ds3', 'G3', 'As3'],
  'E': ['E3', 'Gs3', 'B3'], 'F': ['F3', 'A3', 'C4'], 'F#': ['Fs3', 'As3', 'Cs4'], 'G': ['G3', 'B3', 'D4'],
  'G#': ['Gs3', 'B3', 'Ds4'], 'A': ['A3', 'Cs4', 'E4'], 'A#': ['As3', 'D4', 'F4'], 'B': ['B3', 'Ds4', 'Fs4'],
  'Bb': ['As3', 'D4', 'F4'], 'Eb': ['Ds3', 'G3', 'As3'], 'Ab': ['Gs3', 'C4', 'Ds4'], 'Db': ['Cs3', 'F3', 'Gs3'],

  // Minor triads
  'Cm': ['C3', 'Ds3', 'G3'], 'C#m': ['Cs3', 'E3', 'Gs3'], 'Dm': ['D3', 'F3', 'A3'], 'D#m': ['Ds3', 'Fs3', 'As3'],
  'Em': ['E3', 'G3', 'B3'], 'Fm': ['F3', 'Gs3', 'C4'], 'F#m': ['Fs3', 'A3', 'Cs4'], 'Gm': ['G3', 'As3', 'D4'],
  'G#m': ['Gs3', 'B3', 'Ds4'], 'Am': ['A3', 'C4', 'E4'], 'A#m': ['As3', 'Cs4', 'Es4'], 'Bm': ['B3', 'D4', 'Fs4'],
  'Bbm': ['As3', 'Cs4', 'F4'], 'Ebm': ['Ds3', 'Fs3', 'As3'], 'Abm': ['Gs3', 'B3', 'Ds4'], 'Dbm': ['Cs3', 'E3', 'Gs3'],

  // Dominant 7th
  'C7': ['C3', 'E3', 'G3', 'As3'], 'C#7': ['Cs3', 'F3', 'Gs3', 'B3'], 'D7': ['D3', 'Fs3', 'A3', 'C4'],
  'D#7': ['Ds3', 'G3', 'As3', 'Cs4'], 'E7': ['E3', 'Gs3', 'B3', 'D4'], 'F7': ['F3', 'A3', 'C4', 'Ds4'],
  'F#7': ['Fs3', 'As3', 'Cs4', 'E4'], 'G7': ['G3', 'B3', 'D4', 'F4'], 'G#7': ['Gs3', 'B3', 'Ds4', 'F4'],
  'A7': ['A3', 'Cs4', 'E4', 'G4'], 'A#7': ['As3', 'Cs4', 'Es4', 'Gs4'], 'B7': ['B3', 'Ds4', 'Fs4', 'A4'],
  'Bb7': ['As3', 'D4', 'F4', 'Gs4'], 'Eb7': ['Ds3', 'G3', 'As3', 'Cs4'], 'Ab7': ['Gs3', 'C4', 'Ds4', 'Fs4'],
  'Db7': ['Cs3', 'F3', 'Gs3', 'B3'],

  // Diminished
  'Bdim': ['B3', 'D4', 'F4'], 'C#dim': ['Cs3', 'E3', 'G3'], 'D#dim': ['Ds3', 'Fs3', 'A3'], 'Edim': ['E3', 'G3', 'As3'],
  'F#dim': ['Fs3', 'A3', 'C4'], 'G#dim': ['Gs3', 'B3', 'D4'], 'A#dim': ['As3', 'Cs4', 'E4'], 'Bbdim': ['As3', 'Cs4', 'F4'],
  'Ebdim': ['Ds3', 'Fs3', 'As3'], 'Abdim': ['Gs3', 'B3', 'D4'], 'Dbdim': ['Cs3', 'E3', 'Gs3'],

  // Theoretical enharmonics
  'E#': ['Es3', 'Gs3', 'B3'], 'Fx': ['Fss3', 'As3', 'Cs4'], 'E#7': ['Es3', 'Gs3', 'Bs3', 'D4']
};

