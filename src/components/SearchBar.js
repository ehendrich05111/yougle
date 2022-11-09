import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Card, Paper, InputBase, IconButton } from "@mui/material";
import { API_BASE } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { Clear } from "@mui/icons-material";

const historyLength = 6;

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
          // Handle case when number of entries is less than the max
          // display size
          if (res.data.history.length > historyLength) {
            const tempHist = res.data.history.slice(
              res.data.history.length - historyLength,
              res.data.history.length
            );
            setHistory(tempHist.reverse());
          } else setHistory(res.data.history.reverse());
        }
      });
  };

  const delHistoryItem = () => {
    console.log("Deleted!");
  };

  const submitQuery = () => {
    props.onSubmit(query);
  };

  return (
    <div
      onFocus={() => {
        setShowHistory(true);
      }}
      onMouseDown={(e) => {
        console.log(e);
        getHistory();
        if (
          e.target.className !==
          "MuiInputBase-input css-yz9k0d-MuiInputBase-input"
        ) {
          e.preventDefault();
        } else {
          setShowHistory(true);
        }
      }}
      onBlur={(e) => {
        setShowHistory(false);
      }}
    >
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
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
            zIndex: 1,
          }}
        >
          <div className="Search-Hist-List">
            {history.map((item, idx) => (
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                class="Search-Hist-Item"
              >
                <button
                  onClick={() => {
                    setQuery(item);
                    props.onSubmit(item);
                    setShowHistory(false);
                  }}
                  className="Search-Hist-Button"
                  key={idx}
                  style={{ width: "100%" }}
                >
                  {item}
                </button>
                <IconButton
                  type="button"
                  class="Search-Hist-Del-Button"
                  onClick={delHistoryItem}
                  disableRipple={true}
                >
                  <Clear />
                </IconButton>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
