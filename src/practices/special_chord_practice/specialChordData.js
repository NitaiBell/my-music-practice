// src/data/musicTheory/specialChordData.js

// src/practices/special_chord_practice/logicSpecialChord.js
export const chordLabelToLogicKey = {
    '♯III': 'sharpIII',
    '♭III': 'flatIII',
    'V7/vi': 'V7_vi',
    'V7/ii': 'V7_ii',
    'chromatic mediant': 'chromaticMediant',
    '♭VII': 'flatVII',
    'V/iii': 'V_iii',
    'V/V': 'V_V',
    'V7/V': 'V7_V',
    'Neapolitan': 'neapolitan',
    '♭VI': 'flatVI',
    'V7/iii': 'V7_iii',
    'V7/iv': 'V7_iv',
    'ii → V7/vi': 'ii_vi',
    'v': 'v',
    'V7': 'V7',
    'IV7': 'IV7',
  };
 
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

export const chordFunctionsByScale = {
    C: {
      sharpIII: 'E', // III, typically leads to Am
      V7_vi: 'E7', // V7/vi, typically leads to Am
      V7_ii: 'A7', // V7/ii, typically leads to Dm
      iv: 'Fm', // iv, typically leads to C or G
      flatIII: 'Eb', // bIII, typically leads to Ab or F
      chromaticMediant: 'Abm', // Chromatic Mediant, typically leads to C
      flatVII: 'Bb', // bVII, typically leads to F or C
      V_iii: 'B', // V/iii, typically leads to Em
      V_V: 'D', // V/V, typically leads to G or F
      V7_V: 'D7', // V7/V, typically leads to G
      flatVI: 'Ab', // bVI, typically leads to G or C
      neapolitan: 'Db', // Neapolitan, typically leads to G
      V7_iii: 'B7', // V7/iii, typically leads to Em
      V7_iv: 'C7', // V7/iv, typically leads to Fm
      ii_vi: 'Bm', // ii/vi, typically leads to E7
      v: 'Gm', // v, typically leads to F or C
      V7: 'C7', // V7, typically leads to C
      IV7: 'F7', // IV7, typically leads to C or F
    },
    D: {
      sharpIII: 'F#', // III, typically leads to Bm
      V7_vi: 'F#7', // V7/vi, typically leads to Bm
      V7_ii: 'B7', // V7/ii, typically leads to Em
      iv: 'Gm', // iv, typically leads to D or A
      flatIII: 'F', // bIII, typically leads to Bb or G
      chromaticMediant: 'Bbm', // Chromatic Mediant, typically leads to D
      flatVII: 'C', // bVII, typically leads to G or D
      V_iii: 'C#', // V/iii, typically leads to F#m
      V_V: 'E', // V/V, typically leads to A or G
      V7_V: 'E7', // V7/V, typically leads to A
      flatVI: 'Bb', // bVI, typically leads to A or D
      neapolitan: 'Eb', // Neapolitan, typically leads to A
      V7_iii: 'C#7', // V7/iii, typically leads to F#m
      V7_iv: 'D7', // V7/iv, typically leads to Gm
      ii_vi: 'C#m', // ii/vi, typically leads to F#7
      v: 'Am', // v, typically leads to G or D
      V7: 'D7', // V7, typically leads to D
      IV7: 'G7', // IV7, typically leads to D or G
    },
    E: {
      sharpIII: 'G#', // III, typically leads to C#m
      V7_vi: 'G#7', // V7/vi, typically leads to C#m
      V7_ii: 'C#7', // V7/ii, typically leads to F#m
      iv: 'Am', // iv, typically leads to E or B
      flatIII: 'G', // bIII, typically leads to C or A
      chromaticMediant: 'Cm', // Chromatic Mediant, typically leads to E
      flatVII: 'D', // bVII, typically leads to A or E
      V_iii: 'D#', // V/iii, typically leads to G#m
      V_V: 'F#', // V/V, typically leads to B or A
      V7_V: 'F#7', // V7/V, typically leads to B
      flatVI: 'C', // bVI, typically leads to B or E
      neapolitan: 'F', // Neapolitan, typically leads to B
      V7_iii: 'D#7', // V7/iii, typically leads to G#m
      V7_iv: 'E7', // V7/iv, typically leads to Am
      ii_vi: 'D#m', // ii/vi, typically leads to G#7
      v: 'Bm', // v, typically leads to A or E
      V7: 'E7', // V7, typically leads to E
      IV7: 'A7', // IV7, typically leads to E or A
    },
    'F#': {
      sharpIII: 'A#', // III, typically leads to D#m
      V7_vi: 'A#7', // V7/vi, typically leads to D#m
      V7_ii: 'D#7', // V7/ii, typically leads to G#m
      iv: 'Bm', // iv, typically leads to F# or C#
      flatIII: 'A', // bIII, typically leads to D or B
      chromaticMediant: 'Dm', // Chromatic Mediant, typically leads to F#
      flatVII: 'E', // bVII, typically leads to B or F#
      V_iii: 'E#', // V/iii, typically leads to A#m
      V_V: 'G#', // V/V, typically leads to C# or B
      V7_V: 'G#7', // V7/V, typically leads to C#
      flatVI: 'D', // bVI, typically leads to C# or F#
      neapolitan: 'G', // Neapolitan, typically leads to C#
      V7_iii: 'E#7', // V7/iii, typically leads to A#m
      V7_iv: 'F#7', // V7/iv, typically leads to Bm
      ii_vi: 'E#m', // ii/vi, typically leads to A#7
      v: 'C#m', // v, typically leads to B or F#
      V7: 'F#7', // V7, typically leads to F#
      IV7: 'B7', // IV7, typically leads to F# or B
    },
    G: {
      sharpIII: 'B', // III, typically leads to Em
      V7_vi: 'B7', // V7/vi, typically leads to Em
      V7_ii: 'E7', // V7/ii, typically leads to Am
      iv: 'Cm', // iv, typically leads to G or D
      flatIII: 'Bb', // bIII, typically leads to Eb or C
      chromaticMediant: 'Ebm', // Chromatic Mediant, typically leads to G
      flatVII: 'F', // bVII, typically leads to C or G
      V_iii: 'F#', // V/iii, typically leads to Bm
      V_V: 'A', // V/V, typically leads to D or C
      V7_V: 'A7', // V7/V, typically leads to D
      flatVI: 'Eb', // bVI, typically leads to D or G
      neapolitan: 'Ab', // Neapolitan, typically leads to D
      V7_iii: 'F#7', // V7/iii, typically leads to Bm
      V7_iv: 'G7', // V7/iv, typically leads to Cm
      ii_vi: 'F#m', // ii/vi, typically leads to B7
      v: 'Dm', // v, typically leads to C or G
      V7: 'G7', // V7, typically leads to G
      IV7: 'C7', // IV7, typically leads to G or C
    },
    A: {
      sharpIII: 'C#', // III, typically leads to F#m
      V7_vi: 'C#7', // V7/vi, typically leads to F#m
      V7_ii: 'F#7', // V7/ii, typically leads to Bm
      iv: 'Dm', // iv, typically leads to A or E
      flatIII: 'C', // bIII, typically leads to F or D
      chromaticMediant: 'Fm', // Chromatic Mediant, typically leads to A
      flatVII: 'G', // bVII, typically leads to D or A
      V_iii: 'G#', // V/iii, typically leads to C#m
      V_V: 'B', // V/V, typically leads to E or D
      V7_V: 'B7', // V7/V, typically leads to E
      flatVI: 'F', // bVI, typically leads to E or A
      neapolitan: 'Bb', // Neapolitan, typically leads to E
      V7_iii: 'G#7', // V7/iii, typically leads to C#m
      V7_iv: 'A7', // V7/iv, typically leads to Dm
      ii_vi: 'G#m', // ii/vi, typically leads to C#7
      v: 'Em', // v, typically leads to D or A
      V7: 'A7', // V7, typically leads to A
      IV7: 'D7', // IV7, typically leads to A or D
    },
    B: {
      sharpIII: 'D#', // III, typically leads to G#m
      V7_vi: 'D#7', // V7/vi, typically leads to G#m
      V7_ii: 'G#7', // V7/ii, typically leads to C#m
      iv: 'Em', // iv, typically leads to B or F#
      flatIII: 'D', // bIII, typically leads to G or E
      chromaticMediant: 'Gm', // Chromatic Mediant, typically leads to B
      flatVII: 'A', // bVII, typically leads to E or B
      V_iii: 'A#', // V/iii, typically leads to D#m
      V_V: 'C#', // V/V, typically leads to F# or E
      V7_V: 'C#7', // V7/V, typically leads to F#
      flatVI: 'G', // bVI, typically leads to F# or B
      neapolitan: 'C', // Neapolitan, typically leads to F#
      V7_iii: 'A#7', // V7/iii, typically leads to D#m
      V7_iv: 'B7', // V7/iv, typically leads to Em
      ii_vi: 'A#m', // ii/vi, typically leads to D#7
      v: 'F#m', // v, typically leads to E or B
      V7: 'B7', // V7, typically leads to B
      IV7: 'E7', // IV7, typically leads to B or E
    },
  };
export const chordDisplayMap = Object.entries(chordFunctionsByScale).reduce(
  (map, [scale, functions]) => {
    for (const [func, chord] of Object.entries(functions)) {
      const label = `${func.replace(/_/g, '/')} (${chord})`;
      map[label] = chord;
    }
    return map;
  }, {}
);

export const specialChordsByScale = Object.fromEntries(
  Object.entries(chordFunctionsByScale).map(([scale, funcs]) => [
    scale,
    Object.entries(funcs).map(
      ([func, chord]) => `${func.replace(/_/g, '/')} (${chord})`
    ),
  ])
);

export const chordNoteMap = {
    // Major triads
    'C': ['C3', 'E3', 'G3'],
    'C#': ['Cs3', 'E3', 'Gs3'],
    'D': ['D3', 'Fs3', 'A3'],
    'D#': ['Ds3', 'G3', 'As3'],
    'E': ['E3', 'Gs3', 'B3'],
    'F': ['F3', 'A3', 'C4'],
    'F#': ['Fs3', 'As3', 'Cs4'],
    'G': ['G3', 'B3', 'D4'],
    'G#': ['Gs3', 'B3', 'Ds4'],
    'A': ['A3', 'Cs4', 'E4'],
    'A#': ['As3', 'D4', 'F4'],
    'B': ['B3', 'Ds4', 'Fs4'],
    'Bb': ['As3', 'D4', 'F4'],
    'Eb': ['Ds3', 'G3', 'As3'],
    'Ab': ['Gs3', 'C4', 'Ds4'],
    'Db': ['Cs3', 'F3', 'Gs3'],
  
    // Minor triads
    'Cm': ['C3', 'Ds3', 'G3'],
    'C#m': ['Cs3', 'E3', 'Gs3'],
    'Dm': ['D3', 'F3', 'A3'],
    'D#m': ['Ds3', 'Fs3', 'As3'],
    'Em': ['E3', 'G3', 'B3'],
    'Fm': ['F3', 'Gs3', 'C4'],
    'F#m': ['Fs3', 'A3', 'Cs4'],
    'Gm': ['G3', 'As3', 'D4'],
    'G#m': ['Gs3', 'B3', 'Ds4'],
    'Am': ['A3', 'C4', 'E4'],
    'A#m': ['As3', 'Cs4', 'Es4'],
    'Bm': ['B3', 'D4', 'Fs4'],
    'Bbm': ['As3', 'Cs4', 'F4'],
    'Ebm': ['Ds3', 'Fs3', 'As3'],
    'Abm': ['Gs3', 'B3', 'Ds4'],
    'Dbm': ['Cs3', 'E3', 'Gs3'],
  
    // Dominant 7ths
    'C7': ['C3', 'E3', 'G3', 'As3'],
    'C#7': ['Cs3', 'F3', 'Gs3', 'B3'],
    'D7': ['D3', 'Fs3', 'A3', 'C4'],
    'D#7': ['Ds3', 'G3', 'As3', 'Cs4'],
    'E7': ['E3', 'Gs3', 'B3', 'D4'],
    'F7': ['F3', 'A3', 'C4', 'Ds4'],
    'F#7': ['Fs3', 'As3', 'Cs4', 'E4'],
    'G7': ['G3', 'B3', 'D4', 'F4'],
    'G#7': ['Gs3', 'B3', 'Ds4', 'F4'],
    'A7': ['A3', 'Cs4', 'E4', 'G4'],
    'A#7': ['As3', 'Cs4', 'Es4', 'Gs4'],
    'B7': ['B3', 'Ds4', 'Fs4', 'A4'],
    'Bb7': ['As3', 'D4', 'F4', 'Gs4'],
    'Eb7': ['Ds3', 'G3', 'As3', 'Cs4'],
    'Ab7': ['Gs3', 'C4', 'Ds4', 'Fs4'],
    'Db7': ['Cs3', 'F3', 'Gs3', 'B3'],
  
    // Diminished triads
    'Bdim': ['B3', 'D4', 'F4'],
    'C#dim': ['Cs3', 'E3', 'G3'],
    'D#dim': ['Ds3', 'Fs3', 'A3'],
    'Edim': ['E3', 'G3', 'As3'],
    'F#dim': ['Fs3', 'A3', 'C4'],
    'G#dim': ['Gs3', 'B3', 'D4'],
    'A#dim': ['As3', 'Cs4', 'E4'],
    'Bbdim': ['As3', 'Cs4', 'F4'],
    'Ebdim': ['Ds3', 'Fs3', 'As3'],
    'Abdim': ['Gs3', 'B3', 'D4'],
    'Dbdim': ['Cs3', 'E3', 'Gs3'],
  
    // Theoretical / enharmonic
    'E#': ['Es3', 'Gs3', 'B3'],
    'Fx': ['Fss3', 'As3', 'Cs4'],
    'E#7': ['Es3', 'Gs3', 'Bs3', 'D4']
  };
  
  
  
  


  export const extraChordsByScale = specialChordsByScale;
