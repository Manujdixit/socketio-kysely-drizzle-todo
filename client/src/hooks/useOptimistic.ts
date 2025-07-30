import { useState, useRef } from "react";

/**
 * useOptimistic - React hook for optimistic UI updates with rollback
 * @param initialValue - initial state value
 * @returns [state, optimisticUpdate, rollback]
 */
export function useOptimistic<T>(
  initialValue: T
): [T, (update: T) => void, () => void] {
  const [state, setState] = useState<T>(initialValue);
  const prevRef = useRef<T>(initialValue);

  // Call this before making an optimistic update
  const optimisticUpdate = (update: T) => {
    prevRef.current = state;
    setState(update);
  };

  // Call this to rollback to previous state
  const rollback = () => {
    setState(prevRef.current);
  };

  return [state, optimisticUpdate, rollback];
}
