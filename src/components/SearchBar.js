import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Paper, InputBase, IconButton } from "@mui/material";

export function SearchBar(props) {
  const [query, setQuery] = React.useState(props.query || "");

  const submitQuery = () => {
    props.onSubmit(query);
  };

  return (
    <Paper
      component="form"
      variant="outlined"
      className="Search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        submitQuery();
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search your chats..."
        value={query}
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
  );
}
