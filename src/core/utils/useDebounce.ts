import { useState, useEffect, useRef } from 'react';

export const useDebounce = (value: any, delay: number) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  const ref = useRef<any>();

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      ref.current = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(ref.current);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}