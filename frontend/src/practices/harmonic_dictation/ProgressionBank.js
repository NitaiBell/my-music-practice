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
],

'I IV V VI II III VII chromaticMediant': [
  ['I', 'chromaticMediant', 'VI', 'II', 'I'],
],

'I IV V VI II III VII flatVII': [
  ['I', 'flatVII', 'IV', 'V', 'I'],
],

'I IV V VI II III VII V_iii': [
  ['I', 'V_iii', 'III', 'VI', 'I'],
],

'I IV V VI II III VII V_V': [
  ['I', 'V_V', 'V', 'I'],
],

'I IV V VI II III VII V7_V': [
  ['I', 'V7_V', 'V', 'I'],
],

'I IV V VI II III VII flatVI': [
  ['I', 'flatVI', 'IV', 'V', 'I'],
],

'I IV V VI II III VII neapolitan': [
  ['I', 'neapolitan', 'IV', 'V', 'I'],
],

'I IV V VI II III VII V7_iii': [
  ['I', 'V7_iii', 'III', 'VI', 'I'],
],

'I IV V VI II III VII V7_iv': [
  ['I', 'V7_iv', 'iv', 'I'],
],

'I IV V VI II III VII ii_vi': [
  ['I', 'ii_vi', 'VI', 'IV', 'I'],
],

'I IV V VI II III VII v': [
  ['I', 'v', 'I'],
],

'I IV V VI II III VII V7': [
  ['I', 'V7', 'I'],
],

'I IV V VI II III VII IV7': [
  ['I', 'IV7', 'V', 'I'],
],





};