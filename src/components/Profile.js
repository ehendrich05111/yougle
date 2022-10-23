import { AccountCircle, ModeEdit } from "@mui/icons-material";
import { Box, Card, Button, TextField } from "@mui/material";
import React, { useState } from "react";

// TODO: Add account info fetching and add info change mechanism
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditMail, setIsEditMail] = useState(false);
  const [isEditPass, setIsEditPass] = useState(false);

  const handleMainEdit = () => {
    if (isEditing) {
      setIsEditName(false);
      setIsEditMail(false);
      setIsEditPass(false);
    }
    setIsEditing(!isEditing);
  };

  const handleNameEdit = () => {
    setIsEditName(!isEditName);
  };

  const handleMailEdit = () => {
    setIsEditMail(!isEditMail);
  };

  const handlePassEdit = () => {
    setIsEditPass(!isEditPass);
  };

  return (
    <Box className="Acc-box">
      <Card
        className="Acc-card"
        sx={{ borderRadius: "7px", boxShadow: "none" }}
      >
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <AccountCircle id="Acc-pic" />
          {isEditing ? (
            <Button
              variant="contained"
              id="unedit-button"
              style={{ marginTop: "25%" }}
              onClick={handleMainEdit}
            >
              Done
            </Button>
          ) : (
            <Button
              variant="contained"
              id="edit-button"
              style={{ marginTop: "25%" }}
              onClick={handleMainEdit}
            >
              Edit Account Info
            </Button>
          )}
        </Box>
        <Box id="Info-container">
          <span style={{ display: "flex:", justifyContent: "space-between" }}>
            <Box
              className="Col-box"
              style={{ rowGap: isEditing || isEditName ? "1em" : 0 }}
            >
              <span>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h1 style={{ fontSize: "1em", color: "#666" }}>Name</h1>
                  {!isEditing &&
                    (isEditName && !isEditing ? (
                      <Button
                        variant="contained"
                        id="unedit-button"
                        onClick={handleNameEdit}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button id="edit-button" onClick={handleNameEdit}>
                        <ModeEdit
                          sx={{
                            px: 1,
                            py: 0,
                            fontSize: "1.5em",
                            color: "white",
                          }}
                        />
                      </Button>
                    ))}
                </div>
              </span>
              {isEditing || isEditName ? (
                <div className="Row-box">
                  <div className="Info-box">
                    <TextField variant="outlined" label="First" required />
                  </div>
                  <div className="Info-box">
                    <TextField variant="outlined" label="Last" required />
                  </div>
                </div>
              ) : (
                <div> SAMPLE TEXT </div>
              )}
            </Box>
          </span>
          <span style={{ display: "flex:", justifyContent: "space-between" }}>
            <Box
              className="Col-box"
              style={{ rowGap: isEditing || isEditMail ? "1em" : 0 }}
            >
              <span>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h1 style={{ fontSize: "1em", color: "#666" }}>Email</h1>
                  {!isEditing &&
                    (isEditMail && !isEditing ? (
                      <Button
                        variant="contained"
                        id="unedit-button"
                        onClick={handleMailEdit}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button id="edit-button" onClick={handleMailEdit}>
                        <ModeEdit
                          sx={{
                            px: 1,
                            py: 0,
                            fontSize: "1.5em",
                            color: "white",
                          }}
                        />
                      </Button>
                    ))}
                </div>
              </span>
              {isEditing || isEditMail ? (
                <div className="Info-box">
                  <TextField
                    variant="outlined"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
              ) : (
                <div> SAMPLE TEXT </div>
              )}
            </Box>
          </span>
          <span style={{ display: "flex:", justifyContent: "space-between" }}>
            <Box
              className="Col-box"
              style={{ rowGap: isEditing || isEditPass ? "1em" : 0 }}
            >
              <span>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h1 style={{ fontSize: "1em", color: "#666" }}>Password</h1>
                  {!isEditing &&
                    (isEditPass && !isEditing ? (
                      <Button
                        variant="contained"
                        id="unedit-button"
                        onClick={handlePassEdit}
                      >
                        Done
                      </Button>
                    ) : (
                      <Button id="edit-button" onClick={handlePassEdit}>
                        <ModeEdit
                          sx={{
                            px: 1,
                            py: 0,
                            fontSize: "1.5em",
                            color: "white",
                          }}
                        />
                      </Button>
                    ))}
                </div>
              </span>
              {isEditing || isEditPass ? (
                <Box className="Row-box">
                  <TextField
                    variant="outlined"
                    type="password"
                    label="Old"
                    required
                  />
                  <TextField
                    variant="outlined"
                    type="password"
                    label="New"
                    required
                  />
                </Box>
              ) : (
                <div>
                  &#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;
                </div>
              )}
            </Box>
          </span>
        </Box>
      </Card>
    </Box>
  );
}
