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
  const barColor = props.navColor;

  const { handleLogout } = useAuth();

  const signOut = () => {
    handleLogout();
  };

  return (
    <div className="Navbar" style={{ backgroundColor: barColor }}>
      <div className="Bar">
        {Object.entries(MainPages).map(([name, path]) =>
          ["Profile", "Settings"].includes(name) ? null : (
            <Link to={path} key={path} className="Nav-link">
              {name}
            </Link>
          )
        )}
      </div>
      <div id="account-buttons">
        <Link to="/settings" className="Nav-link" style={{ paddingLeft: 0 }}>
          <IconButton>
            <SettingsOutlined />
          </IconButton>
        </Link>
        <Link to="/profile" className="Nav-link" style={{ paddingLeft: 0 }}>
          <IconButton>
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
