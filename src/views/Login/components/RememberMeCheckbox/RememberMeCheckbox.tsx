import { Checkbox, CheckboxProps } from "@mui/material";
import React, { useCallback, useState } from "react";

interface IRememberMeCheckboxProps extends CheckboxProps {
  fetchIsRememberedFn: Function;
}

const RememberMeCheckbox: React.FC<IRememberMeCheckboxProps> = ({ fetchIsRememberedFn }) => {
  const [isRemembered, setIsRemembered] = useState<boolean>(false);

  const handleRememberAccount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      fetchIsRememberedFn(!!event.target.checked); // !! cast to bool
      setIsRemembered(!!event.target.checked);
    },
    [setIsRemembered, fetchIsRememberedFn]
  );

  return <Checkbox checked={isRemembered} onChange={handleRememberAccount} />;
};

export default React.memo(RememberMeCheckbox);
