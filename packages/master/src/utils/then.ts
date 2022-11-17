import { Observable } from 'rxjs';

export function then<I, O>(value: O) {
  return (source: Observable<I>) =>
    new Observable<O>((subscriber) =>
      source.subscribe({
        error: (err) => subscriber.error(err),
        complete: () => {
          subscriber.next(value);
          subscriber.complete();
        },
      }),
    );
}
