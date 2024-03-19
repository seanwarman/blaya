export const PAGE_SIZE = 100;
export const PLAYLISTS_STATE_KEY = 'blaya__PLAYLISTS_STATE_KEY';
export const INITIAL_PLAYLIST = ['' , 0, []];
export const INITIAL_PLAYLISTS_STATE = [INITIAL_PLAYLIST];
export const START_DATE_PARAMS = ['01/01/0001', 'DD/MM/YYYY'];
export const KEY_MAPS = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
export const ARP_PATTERNS = {
  Off: [],
  1: Array(256).fill().map((_,i) => i % 64 === 0 ? true : undefined),
  2: Array(256).fill().map((_,i) => i % 48 === 0 ? true : undefined),
  3: Array(256).fill().map((_,i) => 
    i === 0 || i === 40 || i === 64 || i === 104 || i === 128 || i === 168 || i === 192 || i === 232
    ? true : undefined),
  4: Array(256).fill().map((_,i) => i % 32 === 0 ? true : undefined),
  5: Array(256).fill().map((_,i) => 
    i === 0         || i === 64       || i === 128      || i === 192
    || i === 22     || i === 86       || i === 150      || i === 214
    || i === 42     || i === 106      || i === 170      || i === 234
    ? true : undefined),
  6: Array(256).fill().map((_,i) => i % 16 === 0 ? true : undefined),
  7: Array(256).fill().map((_,i) => 
    i === 0         || i === 32      || i === 64      || i === 96      || i === 128      || i === 160      || i === 192      || i === 224
    || i === 10     || i === 42      || i === 74      || i === 106     || i === 138      || i === 170      || i === 202      || i === 234
    || i === 21     || i === 53      || i === 85      || i === 117     || i === 149      || i === 181      || i === 213      || i === 245
    ? true : undefined),
  8: Array(256).fill().map((_,i) => i % 8 === 0 ? true : undefined),
  9: Array(256).fill().map((_,i) => i % 4 === 0 ? true : undefined),
  // 0     16    32    48
  // 64    80    96    112
  // 128   144   160   176
  // 192   208   224   240
};

export const LOOPBAR_LENGTH_DEFAULT = 1;
