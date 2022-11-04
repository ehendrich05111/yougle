import {
  Button,
  Dialog,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Slide,
  Switch,
  Typography,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { API_BASE, fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FullPageCard from "../FullPageCard";
import PropTypes from "prop-types";
import { Warning } from "@mui/icons-material";

// Clear History Dialog Animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Clear History Dialog
const SimpleDialog = (props) => {
  const { onClear, open } = props;

  const handleCancel = () => {
    onClear(false);
  };

  const handleDelete = (event) => {
    if (event.target.id === "conf-del") onClear(true);
  };

  return (
    <Dialog
      onClose={handleCancel}
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          borderRadius: "15px",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "space-between",
          fontSize: "1.5em",
        }}
      >
        <Warning
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            alignSelf: "center",
            fontSize: "3em",
            backgroundColor: "orange",
            marginTop: "5%",
            padding: "7.5%",
            borderRadius: "100%",
            overflow: "visible",
          }}
        />
        <p style={{ margin: "20px" }}>Your history will be cleared</p>
      </DialogTitle>
      <p
        style={{
          textAlign: "center",
          color: "rgb(100, 100, 100)",
          transform: "translateY(-10px)",
        }}
      >
        You cannot undo this!
      </p>
      <Box style={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          id="conf-del"
          variant="contained"
          style={{
            backgroundColor: "red",
            marginLeft: "5%",
            marginBottom: "5%",
            height: "20%",
            width: "40%",
          }}
          onClick={handleDelete}
        >
          I'm Sure
        </Button>
        <Button
          id="cancel-del"
          variant="contained"
          style={{
            backgroundColor: "rgba(128, 128, 128, 0.25)",
            color: "black",
            marginRight: "5%",
            marginBottom: "5%",
            height: "20%",
            width: "40%",
          }}
          onClick={handleCancel}
        >
          My Bad
        </Button>
      </Box>
    </Dialog>
  );
};

// Clear History Dialog props
SimpleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default function Settings() {
  const { token } = useAuth();
  const { data, error, mutate } = useSWR(["/settings", token], fetcher);
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState(undefined);
  const [isClear, setIsClear] = useState(false);
  const [isHistory, setIsHistory] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/searchHistory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          enqueueSnackbar(res.error, { variant: "error" });
        } else {
          setIsHistory(res.data.history.length !== 0);
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  }, [isClear, enqueueSnackbar, token]);

  function ReplayTour() {
    localStorage.removeItem("shepherd-tour");
    window.location.href = "/";
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

  const onClearHistory = (confClear) => {
    if (confClear) {
      fetch(`${API_BASE}/searchHistory`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            enqueueSnackbar(res.error, { variant: "error" });
          } else {
            if (res.message === null) {
              enqueueSnackbar("Your history is now history", {
                variant: "success",
              });
            } else {
              enqueueSnackbar(res.message, {
                variant: "info",
              });
            }
            mutate();
          }
        })
        .catch((err) => {
          enqueueSnackbar(err.message, { variant: "error" });
        });
    }
    setIsClear(!isClear);
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
          <Button variant="outlined" onClick={ReplayTour}>
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
          <SimpleDialog open={isClear} onClear={onClearHistory} />
          <Button
            variant="contained"
            color="error"
            disabled={!isHistory}
            onClick={() => {
              setIsClear(true);
            }}
          >
            Clear History
          </Button>
          <Button
            variant="outlined"
            disabled={settings === data?.data}
            onClick={onSaveSettings}
          >
            Save settings
          </Button>
        </>
      )}
    </FullPageCard>
  );
}
