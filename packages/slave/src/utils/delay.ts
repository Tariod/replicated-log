export function delay<T>(msec: number, callback: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback()), Math.max(msec, 0));
  });
}
