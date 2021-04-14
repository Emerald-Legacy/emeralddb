import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";

export const LoginButton = () => {
  const { loginWithPopup } = useAuth0();
  return (
    <Button
      onClick={() =>
        loginWithPopup()
      }
    >
      Log In
    </Button>
  );
};