import { Clear } from "@mui/icons-material";
import { Alert, IconButton, Typography } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FullPageCard from "../FullPageCard";

export default function History() {
  const { token } = useAuth();
  const { data, error } = useSWR(["/searchHistory", token], fetcher);

  const errorMessage =
    data?.status !== "success" ? data?.message : error?.message;

  // TODO: Complete this once backend for Story #31 is complete
  const delHistoryItem = () => {
    console.log("Deleted!");
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
                onClick={delHistoryItem}
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
