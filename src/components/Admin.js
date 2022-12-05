import React from "react";
import { API_BASE } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "notistack";


export default function Admin() {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState("");

  fetch(`${API_BASE}/admin`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== "success") { 
        throw new Error(res.message);
        
        //return null;
      }
    })
    .catch((err) => {
      setError(err.message);
      enqueueSnackbar(err.message, { variant: "error" });
    }); 
  if (!error) {
    return (
      <div>
        <h1>
          This is a test header.
        </h1>
      </div>
    );
  }
}