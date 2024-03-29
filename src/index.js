import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/AuthContext";
import { SnackbarProvider } from "notistack";
import { ShepherdTour } from "react-shepherd";
import { steps, tourOptions } from "./components/landing/Tour";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // disable strict mode to avoid adding two duplicate services
  // <React.StrictMode> 
    <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
      <AuthProvider>
        <ShepherdTour steps={steps} tourOptions={tourOptions}>
          <App />
        </ShepherdTour>
      </AuthProvider>
    </SnackbarProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
