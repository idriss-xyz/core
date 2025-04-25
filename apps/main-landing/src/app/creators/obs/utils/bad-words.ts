/**
 * List of words that should be filtered from donation messages
 */
const BAD_WORDS: string[] = [
  'anal',
  'anus',
  'arse',
  'ass',
  'ballsack',
  'balls',
  'bastard',
  'bitch',
  'biatch',
  'bloody',
  'blowjob',
  'blow job',
  'bollock',
  'bollok',
  'boner',
  'boob',
  'bugger',
  'bum',
  'butt',
  'buttplug',
  'clitoris',
  'cock',
  'coon',
  'crap',
  'cunt',
  'damn',
  'dick',
  'dildo',
  'dyke',
  'fag',
  'feck',
  'fellate',
  'fellatio',
  'felching',
  'fuck',
  'fudgepacker',
  'fudge packer',
  'flange',
  'goddamn',
  'god damn',
  'hell',
  'homo',
  'jerk',
  'jizz',
  'knobend',
  'knob end',
  'labia',
  'lmao',
  'lmfao',
  'muff',
  'nigger',
  'nigga',
  'penis',
  'piss',
  'poop',
  'prick',
  'pube',
  'pussy',
  'queer',
  'scrotum',
  'sex',
  'shit',
  'slut',
  'smegma',
  'spunk',
  'tit',
  'tits',
  'tosser',
  'turd',
  'twat',
  'vagina',
  'wank',
  'whore',
  'wtf',
];

function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[!1|i]/g, 'i')
    .replace(/[$5]/g, 's')
    .replace(/[3]/g, 'e')
    .replace(/[0]/g, 'o')
    .replace(/[7]/g, 't')
    .replace(/[^a-z]/g, ''); // remove non-alphabetic chars
}

export function containsBadWords(message: string): boolean {
  if (!message) return false;

  const normalizedMessage = normalizeForComparison(message);

  return BAD_WORDS.some((word) => normalizedMessage.includes(word));
}
