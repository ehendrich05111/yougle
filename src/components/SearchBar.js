import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Card, Paper, InputBase, IconButton } from "@mui/material";
import { API_BASE } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

const historyLength = 8;

export function SearchBar(props) {
  const [query, setQuery] = useState(props.query || "");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const { token } = useAuth();

  const getHistory = () => {
    fetch(`${API_BASE}/searchHistory/`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          const tempHist = res.data.history.slice(
            res.data.history.length - historyLength,
            res.data.history.length
          );
          setHistory(tempHist);
        }
      });
  };

  const submitQuery = () => {
    props.onSubmit(query);
  };

  return (
    <div>
      <Paper
        component="form"
        variant="outlined"
        className="Search-bar"
        style={{ borderRadius: "0" }}
        onSubmit={(e) => {
          e.preventDefault();
          setShowHistory(false);
          submitQuery();
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search your chats..."
          value={query || ""}
          inputProps={{ "aria-label": "search your chats..." }}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            getHistory();
            setShowHistory(true);
          }}
          onBlur={() => {
            setShowHistory(false);
          }}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={submitQuery}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      {history.length > 0 && showHistory && (
        <Card
          style={{
            position: "absolute",
            borderRadius: "0 0 10px 10px",
            marginLeft: "1px",
            // boxShadow: "none",
            // borderWidth: "thin",
          }}
        >
          <div className="Search-Hist-List">
            {history.map((item, idx) => (
              <div>{item}</div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
