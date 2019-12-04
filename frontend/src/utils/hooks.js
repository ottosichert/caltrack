import { useCallback, useState } from 'react';

export function useInput(defaultValues = {}) {
  const [values, setValues] = useState(defaultValues);
  const handleChange = useCallback(event => {
    const target = event.currentTarget;
    const value = target.multiple
      ? Array.from(target.selectedOptions).map(option => option.value)
      : target.value;
    setValues({ ...values, [target.name]: value });
  }, [values, setValues]);
  return [values, handleChange, setValues];
}
