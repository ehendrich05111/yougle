import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { IconButton } from "@mui/material";
import {
  AccountCircleOutlined,
  Logout,
  SettingsOutlined,
} from "@mui/icons-material";
import { MainPages } from "./landing/Landing";

export default function Navbar(props) {
  const barColor = props.theme ? "black" : "white";

  const { handleLogout } = useAuth();

  const signOut = () => {
    handleLogout();
  };

  return (
    <div className="Navbar" style={{ backgroundColor: barColor }}>
      <div className="Bar">
        {Object.entries(MainPages).map(([name, path]) =>
          ["Profile", "Settings"].includes(name) ? null : (
            <Link
              to={path}
              key={path}
              className={`Nav-link ${name}-Link`}
              style={{ color: props.theme ? "white" : "rgba(0, 0, 0, 0.75)" }}
            >
              {name}
            </Link>
          )
        )}
      </div>
      <div id="account-buttons">
        <Link to="/settings" style={{ paddingLeft: 0 }}>
          <IconButton className="Settings-Link">
            <SettingsOutlined />
          </IconButton>
        </Link>
        <Link to="/profile" style={{ paddingLeft: 0 }}>
          <IconButton className="Profile-Link">
            <AccountCircleOutlined />
          </IconButton>
        </Link>
        <IconButton sx={{ marginRight: 2 }} onClick={signOut}>
          <Logout />
        </IconButton>
      </div>
    </div>
  );
}
