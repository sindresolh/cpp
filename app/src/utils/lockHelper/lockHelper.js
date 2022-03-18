/** Get the lock of the player with a given id
 *
 * @param {*} players : list of all players with lock status
 * @param {*} pid : id of peer
 * @returns
 */
export const getLock = (players, pid) => {
  return players.filter((p) => p.id === pid)[0].lock;
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
};

/** Change the status of a lock to the boolean
 *
 * @param {*} players : list of all players with lock status
 * @param {*} lock : boolean
 * @returns
 */
export const countLocked = (players, lock) => {
  return players.map((p) => (p.lock = lock));
};
