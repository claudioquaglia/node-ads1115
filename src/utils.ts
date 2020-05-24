/**
 * Simple sleep helper
 * @param {number} t - Time in ms to resolve
 */
export const sleep = (t: number) =>
  new Promise(resolve => setTimeout(resolve, t));
