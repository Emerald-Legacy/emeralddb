import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";
import { setToken } from "../../utils/auth";

export const LoginButton = (props: {onLogin: () => void}) => {
  const { loginWithPopup }= useAuth0()

  return (
    <Button
      variant="contained"
      onClick={() =>
        loginWithPopup().then(props.onLogin)
      }
    >
      Log In
    </Button>
  );
};