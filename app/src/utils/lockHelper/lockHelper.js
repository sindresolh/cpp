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
