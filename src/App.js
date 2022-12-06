import React, { Component, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Join from "./components/Join";
import Landing, { MainPages } from "./components/landing/Landing";
import OAuthCallback from "./components/OAuthCallback";
import logo from "./logo.svg";
import "./App.css";
import { useAuth } from "./contexts/AuthContext";
import ChangePassword from "./components/ChangePassword";
import Admin from "./components/Admin";
import { createTheme, ThemeProvider } from "@mui/material";
import useSWR from "swr";
import { fetcher } from "./api/api";

class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
      textFieldString: "",
      capString: "Type some text and click the button to get it in all caps",
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  callAPI() {
    fetch("http://localhost:9000/testAPI")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }))
      .catch((err) => err);
  }

  getCapitalizedText() {
    //fetch("http://localhost:9000/capitalize", {body: JSON.stringify({"textFieldString": this.state.textFieldString})})
    fetch("http://localhost:9000/capitalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ textFieldString: this.state.textFieldString }),
    })
      .then((res) => res.text())
      .then((res) => this.setState({ capString: res }))
      .catch((err) => err);
  }

  componentDidMount() {
    this.callAPI();
  }

  handleTextFieldChange(event) {
    this.setState({ textFieldString: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.apiResponse}</p>
          <p>
            <input
              type="text"
              id="searchbar"
              onChange={this.handleTextFieldChange}
            />
            <button id="clickme" onClick={() => this.getCapitalizedText()}>
              Click me{" "}
            </button>
          </p>
          <p id="capitalizedText">{this.state.capString}</p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

function AuthorizedRoute(props) {
  const { token } = useAuth();
  if (token) {
    return props.children;
  }
  return <Navigate to="/login" />;
}

export default function App() {
  const { token } = useAuth();
  const { data } = useSWR(["/settings", token], fetcher);
  const [isDark, setIsDark] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
    },
  });

  useEffect(() => {
    if (token) setIsDark(data?.data.darkMode);
    document.getElementById("root").style.backgroundColor = isDark
      ? "#1c1e21"
      : "#efefef";
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path="/example" element={<Example theme={isDark} />}></Route>
          <Route path="/login" element={<Login theme={isDark} />}></Route>
          <Route
            path="/forgotpassword"
            element={<ForgotPassword theme={isDark} />}
          ></Route>
          <Route
            path="/changepassword"
            element={<ChangePassword theme={isDark} />}
          ></Route>
          <Route path="/admin" element={<Admin theme={isDark} />}></Route>
          <Route
            path="/slack_callback"
            element={<OAuthCallback serviceName="slack" />}
          ></Route>
          <Route
            path="/teams_callback"
            element={<OAuthCallback serviceName="teams" />}
          ></Route>
          <Route
            path="/reddit_callback"
            element={<OAuthCallback serviceName="reddit" />}
          ></Route>
          <Route path="/signup" element={<Join theme={isDark} />}></Route>
          <Route path="/" element={<Navigate to="/search" />}></Route>
          {Object.values(MainPages).map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <AuthorizedRoute>
                  <Landing page={path} theme={isDark} />
                </AuthorizedRoute>
              }
            />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
