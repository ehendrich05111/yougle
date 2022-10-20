import { AccountCircle } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import FullPageCard from "./FullPageCard";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <FullPageCard>
        <div className="Acc-box">
          <AccountCircle id="Acc-pic" />
          <Box style={{ width: "100%" }}>
            <Box className="Row-box">
              <div className="Info-box">
                <p>First Name</p>
                <TextField variant="outlined" disabled={!isEditing} required />
              </div>
              <div className="Info-box">
                <p>Last Name</p>
                <TextField variant="outlined" disabled={!isEditing} required />
              </div>
            </Box>
            <div>
              <p>Email</p>
              <TextField
                variant="outlined"
                style={{ width: "100%" }}
                disabled={!isEditing}
                required
              />
            </div>
            <Box className="Row-box">
              <div className="Info-box">
                <p>Old Password</p>
                <TextField variant="outlined" type="password" required />
              </div>
              <div className="Info-box">
                <p>New Password</p>
                <TextField variant="outlined" type="password" required />
              </div>
            </Box>
          </Box>
        </div>
      </FullPageCard>
    </div>
  );
}
