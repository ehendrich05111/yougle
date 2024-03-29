import React from "react";
import { ShepherdTourContext } from "react-shepherd";
import Search from "./Search";
import Services from "./Services";
import Navbar from "../Navbar";
import Profile from "../Profile";
import SavedMessages from "./SavedMessages";
import History from "./History";
import Settings from "./Settings";

export const MainPages = {
  Search: "/search",
  Services: "/services",
  Saved: "/saved",
  Profile: "/profile",
  History: "/history",
  Settings: "/settings",
};

export default function Landing(props) {
  const tour = React.useContext(ShepherdTourContext);

  React.useEffect(() => {
    //show tour first time visiting landing page
    if (tour && !localStorage.getItem("shepherd-tour")) {
      tour.start();
      localStorage.setItem("shepherd-tour", "yes");

      //skip initial prompt if not enough time between logins
      if (!localStorage.getItem("return-tour")) {
        tour.show("first-step");
      }
      localStorage.removeItem("return-tour");
    }
  }, [tour]);

  var content = null;
  if (props.page === MainPages.Search) {
    content = <Search theme={props.theme} />;
  } else if (props.page === MainPages.Services) {
    content = <Services theme={props.theme} />;
  } else if (props.page === MainPages.Saved) {
    content = <SavedMessages theme={props.theme} />;
  } else if (props.page === MainPages.Profile) {
    content = <Profile theme={props.theme} />;
  } else if (props.page === MainPages.History) {
    content = <History theme={props.theme} />;
  } else if (props.page === MainPages.Settings) {
    content = <Settings theme={props.theme} />;
  } else {
    content = <p>Invalid page.</p>;
  }

  return (
    <div>
      <Navbar theme={props.theme} />
      {content}
    </div>
  );
}
