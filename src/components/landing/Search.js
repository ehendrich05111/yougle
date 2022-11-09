import React, { useEffect } from "react";
import { SearchBar } from "../SearchBar";
import logo_full from "../../images/logo_full.png";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { API_BASE, fetcher, SERVICE_NAMES } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import useSWR, { useSWRConfig } from "swr";
import slack_icon from "../../images/slack_icon.jpeg";
import teams_icon from "../../images/teams_icon.png";
import { InsertLink, Star, StarBorderOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

const SERVICE_ICONS = {
  slack: slack_icon,
  teams: teams_icon,
};

function SearchResult({
  teamName,
  text,
  channel,
  timestamp,
  username,
  permalink,
  saved,
  onSave,
  service,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date(timestamp * 1000);
  const serviceName = SERVICE_NAMES[service];
  return (
    <Paper variant="outlined" sx={{ width: "fit-content", padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {teamName} #{channel}
        </Typography>
        <Tooltip title={serviceName}>
          <IconButton>
            <img
              src={SERVICE_ICONS[service]}
              alt={`${serviceName} logo`}
              style={{ objectFit: "contain" }}
            />
          </IconButton>
        </Tooltip>
        <IconButton variant="small" onClick={onSave}>
          {saved ? <Star /> : <StarBorderOutlined />}
        </IconButton>
      </Box>
      {permalink ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link href={permalink} target="_blank" rel="noopener noreferrer">
            View in {serviceName}
          </Link>
          <IconButton
            variant="small"
            onClick={() => {
              navigator.clipboard.writeText(permalink);
              enqueueSnackbar("Link copied to clipboard", {
                variant: "success",
              });
            }}
          >
            <InsertLink />
          </IconButton>
        </Box>
      ) : null}
      <Typography variant="body1">
        {username}, {date.toLocaleDateString()}
      </Typography>
      <Typography variant="body2">{text}</Typography>
    </Paper>
  );
}

export default function Search() {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortByDate, setSortByDate] = React.useState(false);
  const query = searchParams.get("q") || "";

  const fetchURL =
    `${API_BASE}/search?` + new URLSearchParams({ queryText: query });

  const { data, error } = useSWR(query ? [fetchURL, token] : null, fetcher, {
    revalidateOnFocus: false,
  });
  const { data: savedMessageData, mutate: mutateSavedMessages } = useSWR(
    ["/saveMessage", token],
    fetcher
  );

  // mutate search history upon data arrival
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (data) {
      mutate(["/searchHistory", token], (data) => {
        if (!data?.data?.history) {
          return data;
        }
        return {
          ...data,
          data: {
            ...data.data,
            history: [...data.data.history, query],
          },
        };
      });
    }
  }, [query, data, token, mutate]);

  function onSave(searchResult) {
    const savedMessage = savedMessageData?.data?.find(
      (msg) => msg.id === searchResult.id
    );

    const promise = !savedMessage
      ? fetch(`${API_BASE}/saveMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ searchResult }),
        })
      : fetch(
          `${API_BASE}/saveMessage?` +
            new URLSearchParams({ messageId: savedMessage._id }),
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

    promise
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "success") {
          throw new Error(res.message);
        }

        enqueueSnackbar(savedMessage ? "Deleted!" : "Saved!", {
          variant: "success",
        });

        const newSavedMessageData = structuredClone(savedMessageData);
        if (savedMessage) {
          newSavedMessageData.data = newSavedMessageData?.data?.filter(
            (msg) => msg.id !== searchResult.id
          );
        } else {
          newSavedMessageData?.data?.push(searchResult);
        }
        mutateSavedMessages(newSavedMessageData);
      })
      .catch((err) => {
        enqueueSnackbar(`Error saving message: ${err.message}`, {
          variant: "error",
        });
      });
  }

  const searchBar = (
    <SearchBar
      query={query}
      onSubmit={(newQuery) => {
        setSearchParams({ q: newQuery });
      }}
    />
  );

  if (!query) {
    return (
      <div className="Main navbarpage">
        <img className="Yougle-logo" src={logo_full} alt="Yougle logo" />
        {searchBar}
        <div className="Table-Results"></div>
      </div>
    );
  }

  const messages = [...(data?.data?.messages || [])];
  if (messages && sortByDate) {
    messages.sort((a, b) => b.timestamp - a.timestamp);
  }

  var content = null;
  if (!data && !error) {
    content = <LinearProgress />;
  } else if (error || data?.status !== "success") {
    content = <Alert severity="error">{error?.message || data?.message}</Alert>;
  } else {
    content = (
      <>
        {
          <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
            <Typography>
              Found {messages.length} results in {data.data.searchTime / 1000}{" "}
              seconds
            </Typography>
            <FormGroup sx={{ margin: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={sortByDate}
                    onChange={(event) => setSortByDate(event.target.checked)}
                  />
                }
                label="Sort by date?"
              />
            </FormGroup>
          </Box>
        }
        {messages.map((result) => (
          <SearchResult
            key={result.id}
            {...result}
            onSave={() =>
              onSave({
                id: result.id,
                service: result.service,
                result: result.text,
                date: result.date,
                reference: result.permalink,
              })
            }
            saved={savedMessageData?.data?.some(
              (savedMessage) => savedMessage.id === result.id
            )}
            service={result.service}
          />
        ))}
      </>
    );
  }

  return (
    <Box sx={{ margin: 2 }}>
      <Box sx={{ display: "flex", gap: 5 }}>
        <img
          className="Yougle-logo"
          src={logo_full}
          alt="Yougle logo"
          style={{ height: "50px" }}
        />
        {searchBar}
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 1 }}
      >
        {content}
      </Box>
    </Box>
  );
}
