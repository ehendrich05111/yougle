import React from "react";
import { SearchBar } from "../SearchBar";
import logo_full from "../../images/logo_full.png";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { API_BASE, fetcher } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import useSWR from "swr";
import slack_icon from "../../images/slack_icon.jpeg";
import teams_icon from "../../images/teams_icon.png";
import { InsertLink, Star } from "@mui/icons-material";
import { useSnackbar } from "notistack";

function SearchResult({
  teamName,
  text,
  channel,
  timestamp,
  username,
  permalink,
  onSave,
  icon,
  service
}) {
  const { enqueueSnackbar } = useSnackbar();
  const date = new Date(timestamp * 1000);
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
        <Tooltip title="Slack">
          <IconButton>
            <img
              src={icon}
              alt="Slack logo"
              style={{ objectFit: "contain" }}
            />
          </IconButton>
        </Tooltip>
        <IconButton
          variant="small"
          onClick={() =>
            onSave({
              service: "slack",
              result: `${username} - ${text}`,
              date: date,
              reference: permalink,
            })
          }
        >
          <Star />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link href={permalink} target="_blank" rel="noopener noreferrer">
          View in {service}
        </Link>
        <IconButton
          variant="small"
          onClick={() => {
            navigator.clipboard.writeText(permalink);
            enqueueSnackbar("Link copied to clipboard", { variant: "success" });
          }}
        >
          <InsertLink />
        </IconButton>
      </Box>
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

  // TODO: error handling
  const { data } = useSWR(query ? [fetchURL, token] : null, fetcher, {
    revalidateOnFocus: false,
  });

  function onSave(searchResult) {
    fetch(`${API_BASE}/saveMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ searchResult }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "success") {
          throw new Error(res.message);
        }

        enqueueSnackbar("Saved!", { variant: "success" });
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
        console.log(newQuery);
        setSearchParams({ q: newQuery });
      }}
    />
  );

  if (!query) {
    return (
      <div className="Main navbarpage">
        <img className="Yougle-logo" src={logo_full} alt="Yougle logo" />
        {searchBar}
      </div>
    );
  }

  const messages = [...(data?.data?.messages || [])];
  if (messages && sortByDate) {
    messages.sort((a, b) => b.timestamp - a.timestamp);
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
        {data ? (
          <>
            {
              <Box sx={{ display: "flex", gap: 5, alignItems: "center" }}>
                <Typography>
                  Found {messages.length} results in{" "}
                  {data.data.searchTime / 1000} seconds
                </Typography>
                <FormGroup sx={{ margin: 0 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={sortByDate}
                        onChange={(event) =>
                          setSortByDate(event.target.checked)
                        }
                      />
                    }
                    label="Sort by date?"
                  />
                </FormGroup>
              </Box>
            }
            {messages.map((result) => {

              if(result.service === "Slack"){
                return(
                <SearchResult
                  key={result.permalink}
                  {...result}
                  onSave={onSave}
                  icon={slack_icon}
                  service={result.service}
                />)
              } else {
                return(
                  <SearchResult
                    key={result.permalink}
                    {...result}
                    onSave={onSave}
                    icon={teams_icon}
                    service={result.service}
                  />)
              }
              })}
          </>
        ) : null}
      </Box>
    </Box>
  );
}
