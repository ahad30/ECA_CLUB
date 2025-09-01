import { useEffect, useState } from "react";


const ErrorHandling = (
  errors,
  isAddModalOpen,
  isEditModalOpen
) => {
  const [error, setError] = useState([]);
  useEffect(() => {
    if (!isAddModalOpen || !isEditModalOpen) {
      setError([]);
    }
  }, [isAddModalOpen, isEditModalOpen]);
  useEffect(() => {
    if (errors) {
      const arr = [];
      for (const key in errors) {
        if (Array.isArray(errors[key])) {
          errors[key].forEach((err) => arr.push(err));
        }
      }
      setError([...arr]);
    }
  }, [errors]);
  return error;
};

export default ErrorHandling;
