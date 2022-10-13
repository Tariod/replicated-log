import { Observable } from 'rxjs';

export function then<T>() {
  return (observable: Observable<T>) => {
    return new Observable<void>((subscriber) => {
      return observable.subscribe({
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete(),
      });
    });
  };
}
