import React, { useState, useEffect, useReducer, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Card, Paper, InputBase, IconButton } from "@mui/material";
import { fetcher } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { Clear } from "@mui/icons-material";
import useSWR from "swr";

const historyLength = 6;

export function SearchBar(props) {
  const { token } = useAuth();
  const { data } = useSWR(["/searchHistory", token], fetcher);
  const [query, setQuery] = useState(props.query || "");
  const [showHistory, setShowHistory] = useState(false);

  const initialState = { selectedIndex: -1 };

  const history = useMemo(() => {
    return (data?.data?.history || []).slice(-historyLength).reverse();
  }, [data?.data?.history]);

  const reducer = (state, action) => {
    switch (action.type) {
      case "arrowUp":
        return {
          selectedIndex:
            state.selectedIndex !== 0
              ? state.selectedIndex - 1
              : history.length - 1,
        };
      case "arrowDown":
        return {
          selectedIndex:
            state.selectedIndex !== history.length - 1
              ? state.selectedIndex + 1
              : 0,
        };
      case "select":
        return { selectedIndex: action.payload };
      default:
        throw new Error();
    }
  };

  const useKeyPress = (targetKey) => {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
      const downHandler = ({ key }) => {
        if (key === targetKey) {
          setKeyPressed(true);
        }
      };

      const upHandler = ({ key }) => {
        if (key === targetKey) {
          setKeyPressed(false);
        }
      };

      window.addEventListener("keydown", downHandler);
      window.addEventListener("keyup", upHandler);

      return () => {
        window.removeEventListener("keydown", downHandler);
        window.removeEventListener("keyup", upHandler);
      };
    }, [targetKey]);

    return keyPressed;
  };

  // TODO: Complete this once backend for Story #31 is complete
  const delHistoryItem = () => {
    console.log("Deleted!");
  };

  const submitQuery = () => {
    props.onSubmit(query);
  };

  // Handle keyboard navigation
  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (arrowUpPressed) {
      dispatch({ type: "arrowUp" });
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      dispatch({ type: "arrowDown" });
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    // only update query if user is navigating through history
    if (state.selectedIndex !== -1 && showHistory) {
      setQuery(history[state.selectedIndex]);
    }
  }, [history, state.selectedIndex, showHistory]);

  return (
    <div
      onFocus={() => {
        setShowHistory(true);
      }}
      onMouseDown={(e) => {
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
            zIndex: 2, // required so mouseleave doesn't fire when hovering over covered checkbox
          }}
        >
          <div className="Search-Hist-List">
            {history.map((item, idx) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor:
                    idx === state.selectedIndex ? "rgba(0,0,0, 0.25)" : "white",
                }}
                key={idx}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "select", payload: idx });
                }}
                onMouseLeave={() => {
                  dispatch({ type: "select", payload: -1 });
                }}
              >
                <button
                  onClick={() => {
                    dispatch({ type: "select", payload: idx });
                    setQuery(item);
                    props.onSubmit(item);
                    setShowHistory(false);
                  }}
                  className="Search-Hist-Button"
                  style={{ width: "100%" }}
                >
                  {item}
                </button>
                <IconButton
                  type="button"
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
