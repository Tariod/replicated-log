interface OrderedLinkedListNode<T> {
  next: OrderedLinkedListNode<T> | null;
  prev: OrderedLinkedListNode<T> | null;
  data: T;
}

export abstract class OrderedLinkedList<T> {
  private head: OrderedLinkedListNode<T> | null = null;
  private tail: OrderedLinkedListNode<T> | null = null;

  protected abstract compareBackward(a: T, b: T): -1 | 0 | 1;

  public push(data: T): OrderedLinkedListNode<T> {
    if (this.tail === null) {
      const node = { prev: null, data, next: null };
      this.head = this.tail = node;
      return node;
    }

    let prev = this.tail;
    while (prev) {
      const compare = this.compareBackward(data, prev.data);

      if (compare === 1) break;
      else if (compare === 0) return prev;
      else if (compare === -1) prev = prev.prev;
    }

    if (!prev) {
      const next = this.head;
      const node = { prev: null, data, next };

      next.prev = node;
      this.head = node;

      return node;
    } else {
      const next = prev.next;
      const node = { prev, data, next };

      if (!next) this.tail = node;
      else next.prev = node;

      prev.next = node;

      return node;
    }
  }

  protected abstract compareForwardFirst(a: T): boolean;

  protected abstract compareForward(a: T, b: T): boolean;

  public list(): T[] {
    const list: T[] = [];

    let curr = this.head;
    if (!curr || !this.compareForwardFirst(curr.data)) {
      return list;
    }

    while (curr.next && this.compareForward(curr.data, curr.next.data)) {
      list.push(curr.data);
      curr = curr.next;
    }
    list.push(curr.data);

    return list;
  }
}
