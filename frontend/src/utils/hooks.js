import { useState } from 'react';

export function useInput(defaultValues = {}) {
  const [values, setValues] = useState(defaultValues);
  const handleChange = event => {
    setValues({
      ...values,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };
  return [values, handleChange];
}
