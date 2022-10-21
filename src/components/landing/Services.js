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
import { API_BASE, fetcher } from "../../api/api";
import FullPageCard from "../FullPageCard";
import { Delete } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "notistack";

const serviceName = {
  slack: "Slack",
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
      <div style={{ alignSelf: "center" }}>
        <a href="https://slack.com/oauth/v2/authorize?client_id=4150752765812.4141695798086&scope=&user_scope=search:read&redirect_uri=https%3A%2F%2Fyougle.herokuapp.com%2Fslack_callback">
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
        <a href="https://login.microsoftonline.com/4130bd39-7c53-419c-b1e5-8758d6d63f21/oauth2/v2.0/authorize?client_id=12718039-8a0c-40d3-bdb4-00fef0b4a2ca&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2FconnectService%2fteamsRedirect&response_mode=form_post&scope=User.Read%20openid%20profile%20offline_access%20Mail.Read%20Chat.ReadWrite&state=12345">
          Add to Teams
        </a>
      </div>
    </FullPageCard>
  );
}
