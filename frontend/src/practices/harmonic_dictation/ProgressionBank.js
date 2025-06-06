// progressionHarmonies.js
export const progressionBank = {
  'I V': [
    ['I', 'V', 'I'],
    ['V', 'I'],
    ['I', 'V', 'V', 'I'],
    ['I', 'V', 'I', 'V'],
    ['V', 'I', 'V', 'I'],
    ['I', 'V', 'I', 'I', 'V'],
  ],
'I IV V': [
  ['I', 'IV', 'V', 'I'],
  ['I', 'V', 'IV', 'V'],
  ['I', 'IV', 'V', 'IV', 'I'],
  ['I', 'IV', 'I', 'V', 'I'],
  ['I', 'V', 'IV', 'I', 'V'],

  ['IV', 'V', 'I', 'IV', 'I'],
  ['IV', 'I', 'V', 'I'],
  ['IV', 'V', 'IV', 'I'],
  ['IV', 'I', 'IV', 'V', 'I'],

  ['V', 'IV', 'I', 'V'],
  ['V', 'I', 'V', 'IV', 'I'],
  ['V', 'I', 'IV', 'V', 'I']
],

  'I IV V VI': [
  // New – starts with I
  ['I', 'VI', 'V', 'IV'],
  ['I', 'IV', 'I', 'VI'],
  ['I', 'V', 'IV', 'VI'],
  ['I', 'IV', 'VI', 'I', 'V'],

  // New – starts with IV
  ['IV', 'I', 'VI', 'V'],
  ['IV', 'VI', 'V', 'I'],
  ['IV', 'V', 'I', 'VI'],
  ['IV', 'I', 'V', 'VI'],

  // New – starts with V
  ['V', 'IV', 'VI', 'I'],
  ['V', 'I', 'VI', 'IV'],
  ['V', 'VI', 'IV', 'I'],
  ['V', 'I', 'IV', 'VI'],

  // New – starts with VI
  ['VI', 'IV', 'I', 'V'],
  ['VI', 'V', 'I', 'IV'],
  ['VI', 'I', 'IV', 'V'],
  ['VI', 'I', 'V', 'IV'],
  ],

  
  'I IV V VI II': [
    ['I', 'IV', 'II', 'V'],
    ['I', 'V', 'II', 'VI'],
    ['I', 'II', 'VI', 'IV'],
    ['I', 'VI', 'II', 'V'],
    ['I', 'IV', 'II', 'V', 'I'],
  
    // Start with IV
    ['IV', 'II', 'V', 'I'],
    ['IV', 'I', 'II', 'VI'],
    ['IV', 'V', 'II', 'I'],
    ['IV', 'VI', 'II', 'V'],
  
    // Start with V
    ['V', 'II', 'I', 'VI'],
    ['V', 'IV', 'II', 'I'],
    ['V', 'I', 'II', 'IV'],
    ['V', 'II', 'VI', 'I', 'IV'],
  
    // Start with VI
    ['VI', 'II', 'IV', 'V'],
    ['VI', 'I', 'II', 'V'],
    ['VI', 'IV', 'II', 'I'],
    ['VI', 'V', 'II', 'I', 'IV'],
  
    // Start with II
    ['II', 'V', 'I', 'VI'],
    ['II', 'IV', 'I', 'V'],
    ['II', 'VI', 'IV', 'I'],
    ['II', 'I', 'V', 'VI'],
    ['II', 'I', 'VI', 'V', 'IV'],
    ['II', 'V', 'IV', 'I'],
],


  'I IV V VI II III': [
  // Start with I
  ['I', 'II', 'V', 'III', 'IV'],
  ['I', 'IV', 'II', 'V', 'III'],
  ['I', 'III', 'V', 'II', 'IV'],
  ['I', 'VI', 'II', 'IV', 'III'],
  ['I', 'V', 'II', 'I', 'III'],

  // Start with IV
  ['IV', 'II', 'V', 'I', 'III'],
  ['IV', 'III', 'I', 'II', 'V'],
  ['IV', 'V', 'III', 'II', 'I'],
  ['IV', 'VI', 'II', 'V', 'III'],
  ['IV', 'I', 'II', 'IV', 'III'],

  // Start with V
  ['V', 'II', 'IV', 'I', 'III'],
  ['V', 'I', 'III', 'II', 'IV'],
  ['V', 'IV', 'II', 'I', 'III'],
  ['V', 'VI', 'II', 'IV', 'III'],
  ['V', 'III', 'I', 'II', 'IV'],

  // Start with VI
  ['VI', 'II', 'IV', 'V', 'III'],
  ['VI', 'I', 'III', 'II', 'V'],
  ['VI', 'V', 'II', 'III', 'IV'],
  ['VI', 'IV', 'II', 'III', 'VI'],
  ['VI', 'III', 'V', 'II', 'I'],

  // Start with II
  ['II', 'V', 'I', 'III', 'IV'],
  ['II', 'IV', 'III', 'V', 'I'],
  ['II', 'I', 'V', 'III', 'IV'],
  ['II', 'III', 'V', 'I', 'IV'],
  ['II', 'IV', 'I', 'V', 'III'],
  ['II', 'III', 'IV', 'V', 'I'],

  // Start with III
  ['III', 'II', 'V', 'I', 'IV'],
  ['III', 'IV', 'II', 'V', 'I'],
  ['III', 'I', 'II', 'V', 'IV'],
  ['III', 'V', 'I', 'II', 'IV'],
  ['III', 'II', 'I', 'IV', 'V']
  ],


  'I IV V VI II III VII': [
  // Start with I
  ['I', 'VII', 'II', 'V', 'III'],
  ['I', 'IV', 'VII', 'III', 'V'],
  ['I', 'VI', 'VII', 'II', 'V'],
  ['I', 'VII', 'III', 'IV', 'V'],

  // Start with IV
  ['IV', 'VII', 'I', 'II', 'V'],
  ['IV', 'V', 'VII', 'III', 'I'],
  ['IV', 'III', 'VII', 'II', 'I'],
  ['IV', 'VII', 'VI', 'II', 'I'],

  // Start with V
  ['V', 'VII', 'III', 'I', 'IV'],
  ['V', 'II', 'VII', 'IV', 'I'],
  ['V', 'VII', 'I', 'VI', 'III'],
  ['V', 'III', 'VII', 'IV', 'I'],

  // Start with VI
  ['VI', 'VII', 'II', 'I', 'V'],
  ['VI', 'IV', 'VII', 'III', 'I'],
  ['VI', 'V', 'VII', 'I', 'III'],
  ['VI', 'VII', 'III', 'II', 'I'],

  // Start with II
  ['II', 'VII', 'I', 'IV', 'V'],
  ['II', 'V', 'VII', 'III', 'I'],
  ['II', 'VII', 'VI', 'I', 'V'],
  ['II', 'III', 'VII', 'IV', 'I'],

  // Start with III
  ['III', 'VII', 'II', 'I', 'V'],
  ['III', 'V', 'VII', 'I', 'IV'],
  ['III', 'VII', 'I', 'VI', 'V'],
  ['III', 'II', 'VII', 'IV', 'I'],

  // Start with VII
  ['VII', 'I', 'IV', 'V', 'III'],
  ['VII', 'III', 'II', 'I', 'V'],
  ['VII', 'I', 'VI', 'III', 'V'],
  ['VII', 'II', 'V', 'I', 'IV'],
  ['VII', 'IV', 'I', 'III', 'V'],
  ['VII', 'III', 'V', 'II', 'I'],
  ],












'I IV V VI II III VII V7/ii': [
  ['I', 'V7/ii', 'II', 'V', 'I'],
  ['I', 'V7/ii', 'II', 'IV', 'I'],
  ['I', 'V7/ii', 'II', 'VII', 'I'],
  ['I', 'IV', 'VI', 'V7/ii', 'II'],
  ['VI', 'V7/ii', 'II', 'V', 'I'],
  ['VI', 'V7/ii', 'II', 'I', 'V'],
  ['VI', 'V7/ii', 'II', 'III', 'I'],
  ['I', 'VI', 'V7/ii', 'II', 'I'],
],

'I IV V VI II III VII sharpIII': [
    // Start with I
    ['I', 'sharpIII', 'VI', 'II', 'V'],
    ['I', 'II', 'sharpIII', 'IV', 'V'],
    ['I', 'V', 'sharpIII', 'VI', 'III'],
    ['I', 'VII', 'sharpIII', 'IV', 'V'],
  
    // Start with IV
    ['IV', 'III', 'sharpIII', 'VI', 'I'],
    ['IV', 'II', 'sharpIII', 'IV', 'V'],
    ['IV', 'V', 'sharpIII', 'VI', 'I'],
    ['IV', 'sharpIII', 'VI', 'III', 'I'],
  
    // Start with V
    ['V', 'II', 'sharpIII', 'IV', 'I'],
    ['V', 'sharpIII', 'VI', 'III', 'IV'],
    ['V', 'I', 'sharpIII', 'IV', 'II'],
    ['V', 'III', 'sharpIII', 'VI', 'I'],
  
    // Start with VI
    ['VI', 'sharpIII', 'IV', 'I', 'V'],
    ['VI', 'III', 'sharpIII', 'IV', 'I'],
    ['VI', 'V', 'sharpIII', 'IV', 'I'],
    ['VI', 'II', 'sharpIII', 'VI', 'I'],
  
    // Start with II
    ['II', 'sharpIII', 'VI', 'IV', 'I'],
    ['II', 'IV', 'sharpIII', 'VI', 'III'],
    ['II', 'I', 'sharpIII', 'IV', 'V'],
    ['II', 'V', 'sharpIII', 'VI', 'I'],
  
    // Start with III
    ['III', 'sharpIII', 'VI', 'IV', 'I'],
    ['III', 'II', 'sharpIII', 'VI', 'V'],
    ['III', 'I', 'sharpIII', 'IV', 'V'],
    ['III', 'V', 'sharpIII', 'VI', 'I'],
  
    // Start with VII
    ['VII', 'I', 'sharpIII', 'VI', 'V'],
    ['VII', 'sharpIII', 'IV', 'II', 'I'],
    ['VII', 'II', 'sharpIII', 'VI', 'IV'],
    ['VII', 'III', 'sharpIII', 'IV', 'I'],
  
    // Start with sharpIII
    ['sharpIII', 'VI', 'II', 'IV', 'V'],
    ['sharpIII', 'IV', 'I', 'V', 'III'],

],


'I IV V VI II III VII V7/vi': [
  // Start with I
  ['I', 'V7/vi', 'VI', 'II', 'V'],
  ['I', 'II', 'V7/vi', 'IV', 'V'],
  ['I', 'V', 'V7/vi', 'VI', 'III'],
  ['I', 'VII', 'V7/vi', 'IV', 'V'],

  // Start with IV
  ['IV', 'III', 'V7/vi', 'VI', 'I'],
  ['IV', 'II', 'V7/vi', 'IV', 'V'],
  ['IV', 'V', 'V7/vi', 'VI', 'I'],
  ['IV', 'V7/vi', 'VI', 'III', 'I'],

  // Start with V
  ['V', 'II', 'V7/vi', 'IV', 'I'],
  ['V', 'V7/vi', 'VI', 'III', 'IV'],
  ['V', 'I', 'V7/vi', 'IV', 'II'],
  ['V', 'III', 'V7/vi', 'VI', 'I'],

  // Start with VI
  ['VI', 'V7/vi', 'IV', 'I', 'V'],
  ['VI', 'III', 'V7/vi', 'IV', 'I'],
  ['VI', 'V', 'V7/vi', 'IV', 'I'],
  ['VI', 'II', 'V7/vi', 'VI', 'I'],

  // Start with II
  ['II', 'V7/vi', 'VI', 'IV', 'I'],
  ['II', 'IV', 'V7/vi', 'VI', 'III'],
  ['II', 'I', 'V7/vi', 'IV', 'V'],
  ['II', 'V', 'V7/vi', 'VI', 'I'],

  // Start with III
  ['III', 'V7/vi', 'VI', 'IV', 'I'],
  ['III', 'II', 'V7/vi', 'VI', 'V'],
  ['III', 'I', 'V7/vi', 'IV', 'V'],
  ['III', 'V', 'V7/vi', 'VI', 'I'],

  // Start with VII
  ['VII', 'I', 'V7/vi', 'VI', 'V'],
  ['VII', 'V7/vi', 'IV', 'II', 'I'],
  ['VII', 'II', 'V7/vi', 'VI', 'IV'],
  ['VII', 'III', 'V7/vi', 'IV', 'I'],

  // Start with V7/vi
  ['V7/vi', 'VI', 'II', 'IV', 'V'],
  ['V7/vi', 'IV', 'I', 'V', 'III'],
],

'I IV V VI II III VII iv': [
  // Ends in I (15)
  ['I', 'IV', 'iv', 'I'],
  ['I', 'iv', 'V', 'I'],
  ['IV', 'V', 'iv', 'I'],
  ['VI', 'IV', 'iv', 'I'],
  ['I', 'V', 'iv', 'I'],
  ['I', 'II', 'iv', 'I'],
  ['III', 'iv', 'V', 'I'],
  ['IV', 'III', 'iv', 'I'],
  ['I', 'iv', 'III', 'I'],
  ['V', 'iv', 'II', 'I'],
  ['VI', 'iv', 'IV', 'I'],
  ['II', 'iv', 'V', 'I'],
  ['I', 'VII', 'iv', 'I'],
  ['IV', 'iv', 'V', 'I'],
  ['V', 'II', 'iv', 'I'],

  // Ends in VI (5)
  ['I', 'IV', 'iv', 'VI'],
  ['iv', 'V', 'II', 'VI'],
  ['III', 'iv', 'IV', 'VI'],
  ['II', 'V', 'iv', 'VI'],
  ['VII', 'iv', 'V', 'VI'],
],


  'I IV V VI II III VII flatIII': [
    ['I', 'flatIII', 'IV', 'V', 'I'],
    ['I', 'flatIII', 'VI', 'V', 'I'], // New: flatIII adds modal mixture; VI (submediant) transitions smoothly to V for a strong cadence. Ex: C - Eb - Am - G - C.
    ['I', 'flatIII', 'II', 'V', 'I'], // New: flatIII creates a dramatic shift; II (subdominant) bridges to V for resolution. Ex: C - Eb - D - G - C.
    ['I', 'flatIII', 'IV', 'VI', 'I'] // New: flatIII adds color; IV and VI (pre-dominants) create a lyrical flow to I. Ex: C - Eb - F - Am - C.
  ],
  'I IV V VI II III VII chromaticMediant': [
    ['I', 'chromaticMediant', 'VI', 'II', 'I'],
    ['I', 'chromaticMediant', 'IV', 'V', 'I'], // New: Chromatic mediant (e.g., Eb or Ab in C major) shifts harmony; IV and V provide a standard resolution. Ex: C - Eb - F - G - C.
    ['I', 'chromaticMediant', 'III', 'VI', 'I'], // New: Chromatic mediant adds color; III and VI maintain a smooth tonal flow. Ex: C - Eb - Em - Am - C.
    ['I', 'chromaticMediant', 'V', 'IV', 'I'] // New: Chromatic mediant introduces tension; V and IV create a plagal-like resolution. Ex: C - Eb - G - F - C.
  ],
  'I IV V VI II III VII flatVII': [
    ['I', 'flatVII', 'IV', 'V', 'I'],
    ['I', 'flatVII', 'VI', 'V', 'I'], // New: flatVII (e.g., Bb in C major) borrows from the parallel minor; VI and V lead to a strong cadence. Ex: C - Bb - Am - G - C.
    ['I', 'flatVII', 'II', 'V', 'I'], // New: flatVII adds modal flavor; II sets up V for a clear resolution. Ex: C - Bb - D - G - C.
    ['I', 'flatVII', 'IV', 'VI', 'I'] // New: flatVII provides color; IV and VI (pre-dominants) create a smooth return to I. Ex: C - Bb - F - Am - C.
  ],
  'I IV V VI II III VII V_iii': [
    ['I', 'V_iii', 'III', 'VI', 'I'],
    ['I', 'V_iii', 'III', 'V', 'I'], // New: V_iii (e.g., B in C major) acts as a secondary dominant to III; III and V resolve strongly to I. Ex: C - B - Em - G - C.
    ['I', 'V_iii', 'VI', 'IV', 'I'], // New: V_iii pulls toward III but moves to VI for a deceptive effect; IV leads back to I. Ex: C - B - Am - F - C.
    ['I', 'V_iii', 'III', 'IV', 'I'] // New: V_iii resolves to III; IV (subdominant) provides a smooth return to I. Ex: C - B - Em - F - C.
  ],
  'I IV V VI II III VII V_V': [
    ['I', 'V_V', 'V', 'I'],
    ['I', 'V_V', 'V', 'IV', 'I'], // New: V_V (e.g., D in C major) acts as a secondary dominant to V; V and IV create a plagal-like resolution. Ex: C - D - G - F - C.
    ['I', 'V_V', 'II', 'V', 'I'], // New: V_V pulls toward V; II bridges as a subdominant to V for resolution. Ex: C - D - D - G - C.
    ['I', 'V_V', 'V', 'VI', 'I'] // New: V_V strengthens the move to V; VI adds a lyrical touch before resolving to I. Ex: C - D - G - Am - C.
  ],
  'I IV V VI II III VII V7_V': [
    ['I', 'V7_V', 'V', 'I'],
    ['I', 'V7_V', 'V', 'IV', 'I'], // New: V7_V (e.g., D7 in C major) strongly pulls to V; IV adds a plagal resolution. Ex: C - D7 - G - F - C.
    ['I', 'V7_V', 'II', 'V', 'I'], // New: V7_V targets V; II (subdominant) sets up the final cadence. Ex: C - D7 - D - G - C.
    ['I', 'V7_V', 'V', 'VI', 'I'] // New: V7_V leads to V; VI provides a lyrical transition to I. Ex: C - D7 - G - Am - C.
  ],
  'I IV V VI II III VII flatVI': [
    ['I', 'flatVI', 'IV', 'V', 'I'],
    ['I', 'flatVI', 'VI', 'V', 'I'], // New: flatVI (e.g., Ab in C major) adds a modal shift; VI and V resolve strongly to I. Ex: C - Ab - Am - G - C.
    ['I', 'flatVI', 'II', 'V', 'I'], // New: flatVI creates a dramatic effect; II bridges to V for resolution. Ex: C - Ab - D - G - C.
    ['I', 'flatVI', 'IV', 'VI', 'I'] // New: flatVI adds color; IV and VI (pre-dominants) lead smoothly to I. Ex: C - Ab - F - Am - C.
  ],
  'I IV V VI II III VII neapolitan': [
    ['I', 'neapolitan', 'IV', 'V', 'I'],
    ['I', 'neapolitan', 'VI', 'V', 'I'], // New: Neapolitan (e.g., Db in C major) adds a dramatic pre-dominant; VI and V resolve to I. Ex: C - Db - Am - G - C.
    ['I', 'neapolitan', 'II', 'V', 'I'], // New: Neapolitan functions as a pre-dominant; II and V lead to a strong cadence. Ex: C - Db - D - G - C.
    ['I', 'neapolitan', 'IV', 'VI', 'I'] // New: Neapolitan provides a rich harmonic shift; IV and VI lead to I. Ex: C - Db - F - Am - C.
  ],
  'I IV V VI II III VII V7_iii': [
    ['I', 'V7_iii', 'III', 'VI', 'I'],
    ['I', 'V7_iii', 'III', 'V', 'I'], // New: V7_iii (e.g., B7 in C major) pulls to III; V strengthens the resolution to I. Ex: C - B7 - Em - G - C.
    ['I', 'V7_iii', 'VI', 'IV', 'I'], // New: V7_iii aims for III but moves to VI for a deceptive effect; IV resolves to I. Ex: C - B7 - Am - F - C.
    ['I', 'V7_iii', 'III', 'IV', 'I'] // New: V7_iii resolves to III; IV provides a smooth return to I. Ex: C - B7 - Em - F - C.
  ],
  'I IV V VI II III VII V7_iv': [
    ['I', 'V7_iv', 'iv', 'I'],
    ['I', 'V7_iv', 'iv', 'V', 'I'], // New: V7_iv (e.g., C7 in C major for Fm) pulls to iv; V adds a dominant resolution. Ex: C - C7 - Fm - G - C.
    ['I', 'V7_iv', 'iv', 'VI', 'I'], // New: V7_iv resolves to iv; VI (submediant) provides a lyrical return to I. Ex: C - C7 - Fm - Am - C.
    ['I', 'V7_iv', 'II', 'V', 'I'] // New: V7_iv aims for iv but pivots to II as a subdominant; V resolves to I. Ex: C - C7 - D - G - C.
  ],
  'I IV V VI II III VII ii_vi': [
    ['I', 'ii_vi', 'VI', 'IV', 'I'],
    ['I', 'ii_vi', 'VI', 'V', 'I'], // New: ii_vi (e.g., Dm7 in C major for Am) pulls to VI; V strengthens the cadence to I. Ex: C - Dm7 - Am - G - C.
    ['I', 'ii_vi', 'II', 'V', 'I'], // New: ii_vi aims for VI but moves to II for a subdominant effect; V resolves to I. Ex: C - Dm7 - D - G - C.
    ['I', 'ii_vi', 'VI', 'II', 'I'] // New: ii_vi resolves to VI; II adds a subdominant lift before returning to I. Ex: C - Dm7 - Am - D - C.
  ],
  'I IV V VI II III VII v': [
    ['I', 'v', 'I'],
    ['I', 'v', 'IV', 'I'], // New: v (e.g., Gm in C major) borrows from the parallel minor; IV (subdominant) resolves to I. Ex: C - Gm - F - C.
    ['I', 'v', 'VI', 'I'], // New: v adds a minor flavor; VI (submediant) provides a smooth return to I. Ex: C - Gm - Am - C.
    ['I', 'v', 'V', 'I'] // New: v introduces modal mixture; V creates a strong dominant resolution. Ex: C - Gm - G - C.
  ],
  'I IV V VI II III VII V7': [
    ['I', 'V7', 'I'],
    ['I', 'V7', 'IV', 'I'], // New: V7 (e.g., G7 in C major) strengthens the dominant; IV adds a plagal resolution. Ex: C - G7 - F - C.
    ['I', 'V7', 'VI', 'I'], // New: V7 pulls to I; VI creates a deceptive, lyrical resolution. Ex: C - G7 - Am - C.
    ['I', 'V7', 'V', 'I'] // New: V7 enhances the dominant function; V reinforces the resolution to I. Ex: C - G7 - G - C.
  ],
  'I IV V VI II III VII IV7': [
    ['I', 'IV7', 'V', 'I'],
    ['I', 'IV7', 'VI', 'I'], // New: IV7 (e.g., F7 in C major) adds a secondary dominant-like color; VI resolves lyrically to I. Ex: C - F7 - Am - C.
    ['I', 'IV7', 'II', 'I'], // New: IV7 functions as a subdominant with extra tension; II leads to a smooth resolution. Ex: C - F7 - D - C.
    ['I', 'IV7', 'IV', 'I'] // New: IV7 enhances the subdominant; IV reinforces the plagal resolution to I. Ex: C - F7 - F - C.
  ]




};