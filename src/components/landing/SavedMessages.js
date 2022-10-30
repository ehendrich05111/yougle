import { Delete } from "@mui/icons-material";
import { Alert, Card, IconButton, Link, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import useSWR from "swr";
import { API_BASE, fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FullPageCard from "../FullPageCard";

export default function SavedMessages() {
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();
  const { data, error, mutate } = useSWR(["/saveMessage", token], fetcher);

  const errorMessage =
    data?.status !== "success" ? data?.message : error?.message;

  function deleteSavedMessage(messageId) {
    fetch(`${API_BASE}/saveMessage?` + new URLSearchParams({ messageId }), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "success") {
          throw new Error(res.message);
        }

        mutate({
          ...res.data,
        });
        enqueueSnackbar("Message deleted.", { variant: "success" });
      })
      .error((err) => {
        enqueueSnackbar(`Error deleting message: ${err.message}`, {
          variant: "error",
        });
      });
  }

  return (
    <FullPageCard navbar loading={!data && !error}>
      <Typography variant="h5" style={{ textAlign: "center" }}>
        Saved Messages
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {data && data?.data?.length === 0 ? (
        <Typography variant="body1">You have no saved messages.</Typography>
      ) : null}
      {data?.data?.map((message) => (
        <Card key={message._id} variant="outlined">
          <IconButton
            variant="small"
            sx={{ float: "right" }}
            onClick={() => deleteSavedMessage(message._id)}
          >
            <Delete />
          </IconButton>
          <p>{message.result}</p>
          <Link href={message.reference} target="_blank">
            View message directly
          </Link>
        </Card>
      ))}
    </FullPageCard>
  );
}
