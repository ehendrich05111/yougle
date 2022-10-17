// TODO: change API base in production
export const API_BASE = "http://localhost:9000";
//export const API_BASE = "https://yougle.herokuapp.com"

export const fetcher = (path, token) =>
  fetch(new URL(path, API_BASE), {
    headers: {
      Authorization: token,
    },
  }).then((res) => res.json());
