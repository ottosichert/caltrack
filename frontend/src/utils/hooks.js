import { useCallback, useState } from 'react';

export function useInput(defaultValues = {}) {
  const [values, setValues] = useState(defaultValues);
  const handleChange = useCallback(event => {
    setValues({
      ...values,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }, [values, setValues]);
  return [values, handleChange, setValues];
}
