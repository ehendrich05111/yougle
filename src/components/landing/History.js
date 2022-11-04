import { Alert, Typography } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import FullPageCard from "../FullPageCard";

export default function History() {
  const { token } = useAuth();
  const { data, error } = useSWR(["/searchHistory", token], fetcher);

  const errorMessage =
    data?.status !== "success" ? data?.message : error?.message;

  const history = data?.data?.history;
  return (
    <FullPageCard navbar loading={!data && !error}>
      <Typography variant="h5" style={{ textAlign: "center" }}>
        Search History
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {data && history?.length === 0 ? (
        <Typography variant="body1" style={{ textAlign: "center" }}>
          You haven't searched for anything yet!
        </Typography>
      ) : null}
      {data && history.length > 0 ? (
        <ol className="history-box">
          {history?.map((item, idx) => (
            <li>
              <div className="history-item">{item}</div>
            </li>
          ))}
        </ol>
      ) : null}
    </FullPageCard>
  );
}
