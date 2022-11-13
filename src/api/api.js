export const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9000"
    : "https://yougle-api.herokuapp.com";

export const SLACK_REDIRECT_URL =
  process.env.NODE_ENV === "development"
    ? "https%3a%2f%2fyougle.local.gd%3a3000%2fslack_callback"
    : "https%3a%2f%2fyougle.herokuapp.com%2fslack_callback";

export const fetcher = (path, token) =>
  fetch(new URL(path, API_BASE), {
    headers: {
      Authorization: token,
    },
  }).then((res) => res.json());

export const SERVICE_NAMES = {
  slack: "Slack",
  teams: "Microsoft Teams",
  reddit: "Reddit",
};
