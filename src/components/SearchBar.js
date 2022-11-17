import React, { useState, useEffect, useReducer, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Card, Paper, InputBase, IconButton } from "@mui/material";
import { API_BASE, fetcher } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { Clear } from "@mui/icons-material";
import useSWR from "swr";
import { useSnackbar } from "notistack";

const historyLength = 6;

export function SearchBar(props) {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { data, mutate } = useSWR(["/searchHistory", token], fetcher);
  const [query, setQuery] = useState(props.query || "");
  const [showHistory, setShowHistory] = useState(false);
  const searchBarRef = React.useRef(null);

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
        mutate({
          ...data.data.history,
          data: { history: data?.data?.history?.splice(idx, 1) },
        });
        enqueueSnackbar("Deleted", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(`Error deleting search: ${err.message}`, {
          variant: "error",
        });
      });
  };

  const submitQuery = () => {
    props.onSubmit(query);
    mutate({ ...data.data.history });
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
      ref={searchBarRef}
      onFocus={() => {
        setShowHistory(true);
      }}
      onBlur={(e) => {
        if (!searchBarRef.current.contains(e.relatedTarget)) {
          setShowHistory(false);
        }
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
                  onClick={() => {
                    delHistoryItem(data.data.history.length - idx - 1);
                  }}
                  disableRipple={true}
                >
                  <Clear className="Search-Hist-Del-Button" />
                </IconButton>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
