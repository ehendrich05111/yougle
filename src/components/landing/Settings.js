import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import useSWR from "swr";
import { API_BASE, fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FullPageCard from "../FullPageCard";


export default function Settings() {
  const { token } = useAuth();
  const { data, error, mutate } = useSWR(["/settings", token], fetcher);
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = React.useState(undefined);

  // TODO: add disable history switch

  function ReplayTour() {
    localStorage.removeItem("shepherd-tour");
    window.location.href="/";
    //const tour = React.useContext(ShepherdTourContext);
    //tour.start();
  }

  const onSaveSettings = () => {
    fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(settings),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          enqueueSnackbar(res.error, { variant: "error" });
        } else {
          enqueueSnackbar("Settings saved", { variant: "success" });
          mutate();
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  React.useEffect(() => {
    setSettings(data?.data);
  }, [data?.data]);

  if (error || (data && data.status !== "success")) {
    const msg = error ? error.message : data.message;
    enqueueSnackbar(msg, { variant: "error" });
    return null;
  }

  return (
    <FullPageCard navbar loading={!data && !error}>
      <Typography variant="h5" style={{ textAlign: "center" }}>
        Settings
      </Typography>
      {settings && (
        <>
          <Button
            variant="outlined"
            onClick={ReplayTour}
          >
            Replay Tour
          </Button>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={(event) =>
                    setSettings({ ...settings, darkMode: event.target.checked })
                  }
                />
              }
              label="Dark mode"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.deepSearch}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      deepSearch: event.target.checked,
                    })
                  }
                />
              }
              label="Deep search"
            />
          </FormGroup>
          <Button
            variant="outlined"
            disabled={settings === data?.data}
            onClick={onSaveSettings}
          >
            Save settings
          </Button>
          <Button variant="contained" color="error">
            Delete account
          </Button>
        </>
      )}
    </FullPageCard>
  );
}
