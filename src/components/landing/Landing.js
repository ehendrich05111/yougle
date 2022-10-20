import React from "react";
import Search from "./Search";
import Services from "./Services";
import Navbar from "../Navbar";
import Profile from "../Profile";
import SavedMessages from "./SavedMessages";

export const MainPages = {
  Search: "search",
  Services: "services",
  Saved: "saved",
  Profile: "profile",
};

export default function Landing(props) {
  var content = null;
  if (props.page === MainPages.Search) {
    content = <Search />;
  } else if (props.page === MainPages.Services) {
    content = <Services />;
  } else if (props.page === MainPages.Saved) {
    content = <SavedMessages />;
  } else if (props.page === MainPages.Profile) {
    content = <Profile />;
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
