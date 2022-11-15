import { Clear } from "@mui/icons-material";
import { Alert, IconButton, Typography } from "@mui/material";
import useSWR from "swr";
import { useSnackbar } from "notistack";
import { API_BASE, fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FullPageCard from "../FullPageCard";

export default function History() {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error, mutate } = useSWR(["/searchHistory", token], fetcher);

  const errorMessage =
    data?.status !== "success" ? data?.message : error?.message;

  const delHistoryItem = (idx) => {
    fetch(`${API_BASE}/searchHistory/deleteSingle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ index: idx }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "success") {
          throw new Error(res.message);
        }
        enqueueSnackbar("Deleted", { variant: "success" });
        mutate({ ...data.data.history });
      })
      .catch((err) => {
        enqueueSnackbar(`Error deleting search: ${err.message}`, {
          variant: "error",
        });
      });
  };

  const history = data?.data?.history;
  return (
    <FullPageCard navbar loading={!data && !error}>
      <Typography variant="h5" style={{ textAlign: "center" }}>
        Search History
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <ol className="history-box">
        {history?.map((item, idx) => (
          <li>
            <div className="history-item">
              <div className="history-text">{item}</div>
              <IconButton
                type="button"
                onClick={() => {
                  delHistoryItem(idx);
                }}
                style={{ borderRadius: "15px" }}
              >
                <Clear />
              </IconButton>
            </div>
          </li>
        ))}
      </ol>
    </FullPageCard>
  );
}
