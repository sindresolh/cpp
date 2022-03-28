/** Get the lock of the player with a given id
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : id of peer
 * @returns
 */
export const getLock = (players, pid) => {
  try {
    return players.filter((p) => p.id === pid)[0].lock;
  } catch (error) {
    return false;
  }
};

/** Get the lock of the player with a given id
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : id of peer
 * @returns
 */
export const getAllLocks = (players) => {
  return players.map((p) => p.lock);
};

/**
 * Set a players lock
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : player id
 * @param {*} lock : boolean
 */
export const setLock = (players, pid, lock) => {
  players.map((p) => (p.id === pid ? (p.lock = lock) : p.lock));
  return players;
};

/**
 * Set a players lock
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : player id
 * @param {*} lock : boolean
 */
export const setAllLocks = (players, lock) => {
  players.map((p) => (p.lock = lock));
  return players;
};

/** Get all the selected blocks
 *
 * @param {*} players : list of all players with select status
 * @param {*} pid : id of peer
 * @returns
 */
export const getSelectedBy = (players, pid) => {
  try {
    return players.filter((p) => p.id === pid)[0].selected;
  } catch (error) {
    return false;
  }
};

/** Get all the selected blocks
 *
 * @param {*} players : list of all players with select status
 * @param {*} pid : id of peer
 * @returns
 */
export const getSelectedBlocks = (players) => {
  return players.map((p) => p.selected);
};

/**
 * Set a players selected block
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : player id
 * @param {*} index : int
 */
export const setSelected = (players, pid, index) => {
  players.map((p) => (p.id === pid ? (p.selected = index) : p.selected));
  return players;
};

/**
 * Set a players selected block
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : player id
 * @param {*} index : int
 */
export const isIndexSelected = (players, index) => {
  return players.some((p) => p.selected === index);
};
