import React from "react";
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
import useSWR from "swr";
import slack_icon from "../../images/slack_icon.jpg";
import teams_icon from "../../images/teams_icon.png";
import reddit_icon from "../../images/reddit_icon.png";
import {
  CopyAll,
  InsertLink,
  OpenInNew,
  Star,
  StarBorderOutlined,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

const SERVICE_ICONS = {
  slack: slack_icon,
  teams: teams_icon,
  reddit: reddit_icon,
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
    <Paper
      variant="outlined"
      sx={{
        minWidth: "18em",
        height: "16em",
        borderRadius: "15px",
        padding: 2,
      }}
      className="Search-item"
    >
      {console.log(service)}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={serviceName}>
            <IconButton disableRipple>
              <img
                src={SERVICE_ICONS[service]}
                alt={`${serviceName} logo`}
                className="Service-img"
              />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className="Chat-title">
            <div id="team-name">{teamName}</div>
            <div id="channel-name"> #{channel}</div>
          </Typography>
        </div>
        <div className="Click-buttons">
          <IconButton
            id="Copy-button"
            variant="small"
            onClick={() => {
              const message = `From ${username} on ${date.toLocaleDateString()}:\n${text}`;
              navigator.clipboard.writeText(message);
              enqueueSnackbar("Message copied to clipboard", {
                variant: "success",
              });
            }}
          >
            <CopyAll />
          </IconButton>
          <IconButton variant="small" onClick={onSave} id="Star-button">
            {saved ? <Star /> : <StarBorderOutlined color="yellow" />}
          </IconButton>
          <IconButton
            id="Link-button"
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
          {permalink ? (
            <Link href={permalink} target="_blank" rel="noopener noreferrer">
              <IconButton id="Open-button" variant="small">
                <OpenInNew />
              </IconButton>
            </Link>
          ) : null}
        </div>
      </Box>

      <div className="Search-text">
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {username}, {date.toLocaleDateString()}:
        </Typography>
        <Typography variant="body2">{text}</Typography>
      </div>
    </Paper>
  );
}

export default function Search() {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortByDate, setSortByDate] = React.useState(false);
  const [searchSlack, setSearchSlack] = React.useState(true);
  const [searchTeams, setSearchTeams] = React.useState(true);
  const query = searchParams.get("q") || "";

  const fetchURL =
    `${API_BASE}/search?` +
    new URLSearchParams({
      queryText: query,
      searchSlack: searchSlack,
      searchTeams: searchTeams,
    });

  const { data, error } = useSWR(query ? [fetchURL, token] : null, fetcher, {
    revalidateOnFocus: false,
  });
  const { data: savedMessageData, mutate: mutateSavedMessages } = useSWR(
    ["/saveMessage", token],
    fetcher
  );

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
            <FormGroup row={true} sx={{ margin: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={sortByDate}
                    onChange={(event) => setSortByDate(event.target.checked)}
                  />
                }
                label="Sort by date?"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={searchSlack}
                    value={searchSlack}
                    onChange={(event) => setSearchSlack(event.target.checked)}
                  />
                }
                label="Search Slack"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={searchTeams}
                    value={searchTeams}
                    onChange={(event) => setSearchTeams(event.target.checked)}
                  />
                }
                label="Search Microsoft Teams"
              />
            </FormGroup>
          </Box>
        }
        <div className="Search-items">
          {messages.map((result) => (
            <SearchResult
              key={result.id}
              {...result}
              onSave={() =>
                onSave({
                  id: result.id,
                  service: result.service,
                  result: result.text,
                  date: result.timestamp,
                  reference: result.permalink,
                })
              }
              saved={savedMessageData?.data?.some(
                (savedMessage) => savedMessage.id === result.id
              )}
              service={result.service}
            />
          ))}
        </div>
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
