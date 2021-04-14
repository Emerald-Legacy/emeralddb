import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";
import { useContext } from "react";
import { Auth0Context } from "../../providers/Auth0ProviderWithHistory";

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const auth0Config = useContext(Auth0Context)
  return (
    <Button
      onClick={() =>
        logout({
          client_id: auth0Config.clientId,
          returnTo: window.location.origin + '/cards',
        })
      }
    >
      Log Out
    </Button>
  );
};