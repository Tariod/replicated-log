import { Observable } from 'rxjs';

export function then<I, O>(value: O) {
  return (observable: Observable<I>) => {
    return new Observable<O>((subscriber) => {
      return observable.subscribe({
        error: (err) => subscriber.error(err),
        complete: () => {
          subscriber.next(value);
          subscriber.complete();
        },
      });
    });
  };
}
