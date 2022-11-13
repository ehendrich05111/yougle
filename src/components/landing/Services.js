import React from "react";
import {
  Alert,
  CircularProgress,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Button,
  IconButton,
  Dialog,
  Typography,
} from "@mui/material";
import useSWR from "swr";
import { API_BASE, fetcher, SLACK_REDIRECT_URL } from "../../api/api";
import FullPageCard from "../FullPageCard";
import { Delete } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "notistack";
import teams_icon from "../../images/teams_icon.png";

const teamsAuthorizeUrl =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
  "client_id=12718039-8a0c-40d3-bdb4-00fef0b4a2ca" +
  "&response_type=code" +
  "&redirect_uri=https%3A%2F%2Fyougle.local.gd%3A3000%2Fteams_callback" +
  "&response_mode=query" +
  // "&scope=User.Read%20Chat.Read%20Chat.ReadWrite%20ChannelMessage.Read.All%20offline_access" +
  "&scope=User.Read%20Chat.Read%20Chat.ReadWrite%20offline_access" +
  "&state=12345" +
  "&prompt=consent";

const redditAuthorizeUrl =
  "https://www.reddit.com/api/v1/authorize?" +
  `client_id=${
    process.env.NODE_ENV === "production"
      ? "NE1iybrvzwrCDRbbLPKXRA"
      : "iluIiVNUNhAK1GXaGg6IQQ"
  }&` +
  `response_type=code&` +
  `state=hithere&` +
  `redirect_uri=${
    process.env.NODE_ENV === "production"
      ? "https://yougle.herokuapp.com/reddit_callback"
      : "https://yougle.local.gd:3000/reddit_callback"
  }&` +
  `duration=permanent&` +
  `scope=privatemessages identity`;

const serviceName = {
  slack: "Slack",
  teams: "Teams",
  reddit: "Reddit",
};

export default function Services() {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, mutate } = useSWR(["/services", token], fetcher);
  const [serviceToDisconnect, setServiceToDisconnect] = React.useState(null);

  const serviceInfos = data?.data || [];
  const errorMessage =
    data?.status !== "success" ? error?.message : data?.message;

  function disconnectService() {
    setServiceToDisconnect(null);
    fetch(`${API_BASE}/disconnectService`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        serviceId: serviceToDisconnect._id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "success") {
          throw new Error(res.message);
        }

        enqueueSnackbar("Service disconnected.", {
          variant: "success",
        });
        mutate({
          ...data,
          data: data.data.filter((s) => s._id !== res.data._id),
        });
      })
      .catch((err) => {
        enqueueSnackbar(`Error disconnecting service: ${err.message}`, {
          variant: "error",
        });
      });
  }

  return (
    <FullPageCard navbar>
      <Dialog
        open={!!serviceToDisconnect}
        onClose={() => setServiceToDisconnect(null)}
      >
        <div style={{ padding: 15 }}>
          <h2>Confirm disconnect</h2>
          <p>
            Are you sure you want to disconnect {serviceToDisconnect?.name}?
          </p>
          <div>
            <Button
              variant="outlined"
              onClick={() => setServiceToDisconnect(null)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ float: "right" }}
              onClick={disconnectService}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Dialog>
      <Typography variant="h5" style={{ textAlign: "center" }}>
        {serviceInfos.length > 0 ? "Manage Services" : "Add a Service!"}
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {!data && !error && <CircularProgress />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Service</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceInfos.map((serviceInfo) => (
            <TableRow key={serviceInfo._id}>
              <TableCell>
                {serviceName[serviceInfo.service]} - {serviceInfo.name}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setServiceToDisconnect(serviceInfo);
                  }}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div
        style={{
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <a
          href={`https://slack.com/oauth/v2/authorize?client_id=4150752765812.4141695798086&scope=&user_scope=search:read&redirect_uri=${SLACK_REDIRECT_URL}`}
        >
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
          <img alt="Microsoft Teams icon" src={teams_icon}></img>
          <a href={teamsAuthorizeUrl}>Add to Teams</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3em" }}>
          <a href={redditAuthorizeUrl}>Add to Reddit</a>
        </div>
      </div>
    </FullPageCard>
  );
}
