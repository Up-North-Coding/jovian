import { Checkbox } from "@mui/material";
import { memo, useCallback, useState } from "react";

interface IRememberMeCheckboxProps {
  fetchIsRememberedFn: (checked: boolean) => void;
}
const RememberMeCheckbox = ({ fetchIsRememberedFn }: IRememberMeCheckboxProps): JSX.Element => {
  const [isRemembered, setIsRemembered] = useState<boolean>(false),
    handleRememberAccount = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        fetchIsRememberedFn(Boolean(event.target.checked)); // !! cast to bool
        setIsRemembered(Boolean(event.target.checked));
      },
      [setIsRemembered, fetchIsRememberedFn]
    );

  return <Checkbox checked={isRemembered} onChange={handleRememberAccount} />;
};

export default memo(RememberMeCheckbox);
