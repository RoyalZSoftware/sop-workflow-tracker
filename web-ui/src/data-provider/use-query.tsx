import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export function useQuery<T>(cb: () => Observable<T>, deps: any[] = []) {
  const [state, updateState] = useState(undefined as T);

  useEffect(() => {
    return () => cb().subscribe((fetchedData) => {
      updateState(fetchedData);
    }).unsubscribe();
  }, []);
  return state;
}
