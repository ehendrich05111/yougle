export const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9000"
    : "https://yougle-api.herokuapp.com";

export const fetcher = (path, token) =>
  fetch(new URL(path, API_BASE), {
    headers: {
      Authorization: token,
    },
  }).then((res) => res.json());
