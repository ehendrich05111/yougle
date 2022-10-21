import React from "react";
import Search from "./Search";
import Services from "./Services";
import Navbar from "../Navbar";
import SavedMessages from "./SavedMessages";
import Tour from "./Tour";

export const MainPages = {
  Search: "search",
  Services: "services",
  Saved: "saved",
};

export default function Landing(props) {
  var content = null;
  if (props.page === MainPages.Search) {
    content = <Search />;

    //show tour first time visiting landing page
    if (!localStorage.getItem('shepherd-tour')) {
      Tour.start();
      localStorage.setItem('shepherd-tour', 'yes');
    }
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
