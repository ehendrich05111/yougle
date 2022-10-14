import React from "react";
import Search from "./Search";
import Services from "./Services";
import Navbar from "../Navbar";
import SavedMessages from "./SavedMessages";

export const MainPages = {
  Search: "search",
  Services: "services",
  Saved: "saved",
};

export default function Landing(props) {
  var content = null;
  if (props.page === MainPages.Search) {
    content = <Search />;
  } else if (props.page === MainPages.Services) {
    content = <Services />;
  } else if (props.page === MainPages.Saved) {
    content = <SavedMessages />;
  } else {
    content = <p>Invalid page.</p>;
  }

  return (
    <div>
      <Navbar />
      {content}
    </div>
  );
}
