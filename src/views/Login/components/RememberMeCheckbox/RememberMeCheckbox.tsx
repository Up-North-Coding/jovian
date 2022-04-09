import { Checkbox, CheckboxProps } from "@mui/material";
import { useCallback, useState } from "react";

interface IRememberMeCheckboxProps extends CheckboxProps {
  fetchIsRememberedFn: Function;
}

const RememberMeCheckbox: React.FC<IRememberMeCheckboxProps> = ({ fetchIsRememberedFn }) => {
  const [isRemembered, setIsRemembered] = useState<boolean>(false);

  const handleRememberAccount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // CR: try double bang here !!event.target.checked and see if it works
      fetchIsRememberedFn(event.target.checked);
      setIsRemembered(event.target.checked);
    },
    [setIsRemembered, fetchIsRememberedFn]
  );

  return <Checkbox checked={isRemembered} onChange={handleRememberAccount} />;
};

// CR: consider returning with React.memo() here, see if it breaks tho
export default RememberMeCheckbox;
