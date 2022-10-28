import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import FullPageCard from "../FullPageCard";

export default function Settings() {
  return (
    <FullPageCard navbar>
      <Typography variant="h5" style={{ textAlign: "center" }}>
        Settings
      </Typography>
      <TextField label="First name" defaultValue="test" />
      <TextField label="Last name" defaultValue="test" />
      <TextField label="Email" defaultValue="email" />
      <Button variant="contained">Change password</Button>
      <FormGroup>
        <FormControlLabel control={<Switch />} label="Dark mode" />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Keep search history"
        />
      </FormGroup>
      <Button variant="contained" color="error">
        Delete account
      </Button>
    </FullPageCard>
  );
}
