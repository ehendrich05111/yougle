import React from "react";
import { API_BASE, fetcher } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "notistack";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Stack } from "@mui/system";
import {
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useSWR from "swr";

export default function Admin() {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [fromTime, setFromTime] = React.useState(null);
  const [toTime, setToTime] = React.useState(null);

  // wrap current timestamp in state so we don't constantly refresh
  const [currTime] = React.useState(Math.floor(Date.now() / 1000));

  const accountRangeParams = {
    from: fromTime?.unix(),
    to: toTime?.unix(),
  };

  const SECS_PER_MONTH = 86400 * 30;
  const activeRangeParams = {
    from: fromTime || toTime ? fromTime?.unix() : currTime - SECS_PER_MONTH,
    to: toTime?.unix(),
  };

  // delete undefined params
  Object.keys(accountRangeParams).forEach((key) =>
    accountRangeParams[key] === undefined ? delete accountRangeParams[key] : {}
  );
  Object.keys(activeRangeParams).forEach((key) =>
    activeRangeParams[key] === undefined ? delete activeRangeParams[key] : {}
  );

  const { data: accountsData, error: accountsError } = useSWR(
    [
      API_BASE + "/admin/accounts?" + new URLSearchParams(accountRangeParams),
      token,
    ],
    fetcher
  );
  const { data: activeData, error: activeError } = useSWR(
    [
      API_BASE + "/admin/active?" + new URLSearchParams(activeRangeParams),
      token,
    ],
    fetcher
  );

  React.useEffect(() => {
    if (accountsError || accountsData?.status === "error") {
      enqueueSnackbar(
        "Failed to fetch number of accounts: " +
          (accountsError?.message || accountsData?.message),
        {
          variant: "error",
        }
      );
    }
  }, [accountsError, accountsData, enqueueSnackbar]);

  React.useEffect(() => {
    if (activeError || activeData?.status === "error") {
      enqueueSnackbar(
        "Failed to fetch number of active accounts: " +
          (activeError?.message || activeData?.message),
        {
          variant: "error",
        }
      );
    }
  }, [activeError, activeData, enqueueSnackbar]);

  return (
    <Card>
      <Typography variant="h4">Admin page</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={2}>
          <DateTimePicker
            label="From"
            renderInput={(props) => <TextField {...props} />}
            value={fromTime}
            onChange={setFromTime}
          />
          <DateTimePicker
            label="To"
            renderInput={(props) => <TextField {...props} />}
            value={toTime}
            onChange={setToTime}
          />
          <Button
            variant="outlined"
            onClick={() => {
              setFromTime(null);
              setToTime(null);
            }}
          >
            Clear time range
          </Button>
        </Stack>
      </LocalizationProvider>
      <Typography variant="h5">Results</Typography>
      {!accountsData ? (
        <CircularProgress />
      ) : (
        <Typography>Number of accounts: {accountsData?.data}</Typography>
      )}
      {!accountsData ? (
        <CircularProgress />
      ) : (
        <Typography>
          Number of active accounts {!fromTime && !toTime && "(past 30 days)"}:{" "}
          {activeData?.data}
        </Typography>
      )}
    </Card>
  );
}
