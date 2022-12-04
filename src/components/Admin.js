import React from "react";
import { API_BASE } from "../api/api";

export default function Admin() {
  fetch(`${API_BASE}/admin`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== "success") {
        throw new Error(res.message);
      }
    });  
  return (
    <div>
      <h1>
        This is a test header.
      </h1>
    </div>
  );
}