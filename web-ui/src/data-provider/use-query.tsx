import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export function useQuery<T>(cb: () => Observable<T>, deps: any[] = [], defaultValue?: any) {
  const [state, updateState] = useState(defaultValue as T);

  useEffect(() => {
    return () => cb().subscribe((fetchedData) => {
      updateState(fetchedData);
    }).unsubscribe();
  }, deps);
  return state;
}
