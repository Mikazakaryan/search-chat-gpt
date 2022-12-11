import { useState, FC, useCallback } from "react";

import "./index.css";

const Input: FC<{ setValue: (value: string) => void }> = ({ setValue }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const passValues = useCallback(() => {
    setValue(searchTerm);
  }, [setValue, searchTerm]);

  const handleEnter = (event: any) => {
    if (event.key === "Enter") {
      passValues();
    }
  };

  return (
    <input
      value={searchTerm}
      onKeyDown={handleEnter}
      placeholder="Type and press Enter"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};

export default Input;
