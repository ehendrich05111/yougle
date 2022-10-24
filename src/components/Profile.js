import { AccountCircle, ModeEdit } from "@mui/icons-material";
import { Box, Card, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_BASE } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

// TODO: Fix CSS
export default function Profile() {
  const { token } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditMail, setIsEditMail] = useState(false);
  const [isEditPass, setIsEditPass] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    if (!(firstName && lastName && email) || isSubmitted) {
      fetch(`${API_BASE}/profile`, {
        method: "GET",
        headers: { "Content-Type": "applications/json", Authorization: token },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status !== "success") {
            alert("User info fetch failed");
          }

          setFirstName(res.data.firstName);
          setLastName(res.data.lastName);
          setEmail(res.data.email);

          setIsSubmitted(false);
        });
    }
  }, [firstName, lastName, email]);

  const handleMainEdit = () => {
    if (isEditing) {
      handleNameEdit();
      handleMailEdit();
      handlePassEdit();

      setIsEditName(false);
      setIsEditMail(false);
      setIsEditPass(false);
    }
    setIsEditing(!isEditing);
  };

  const handleNameEdit = () => {
    if (isEditName || isEditing) submitName();
    setIsEditName(!isEditName);
  };

  const handleMailEdit = () => {
    if (isEditMail || isEditing) submitMail();
    setIsEditMail(!isEditMail);
  };

  const handlePassEdit = () => {
    if (isEditPass || isEditing) submitPass();
    setIsEditPass(!isEditPass);
  };

  const submitName = () => {
    fetch(`${API_BASE}/changeName`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        newFirstName: firstName,
        newLastName: lastName,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "error") {
          alert(res.message);
        }
      });
    setIsSubmitted(true);
  };

  const submitMail = () => {
    fetch(`${API_BASE}/changeEmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        newEmail: email,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "error") {
          alert(res.message);
        }
      });
    setIsSubmitted(true);
  };

  const submitPass = () => {
    fetch(`${API_BASE}/changePassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        oldPassword: oldPass,
        newPassword: newPass,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "error") {
          alert(res.message);
        }
      });
    setIsSubmitted(true);
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
                    <TextField
                      defaultValue={firstName}
                      variant="outlined"
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      label="First"
                      required
                    />
                  </div>
                  <div className="Info-box">
                    <TextField
                      defaultValue={lastName}
                      variant="outlined"
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                      label="Last"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div> {firstName + " " + lastName} </div>
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
                    defaultValue={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    style={{ width: "100%" }}
                    required
                  />
                </div>
              ) : (
                <div> {email} </div>
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
                    onChange={(e) => {
                      setOldPass(e.target.value);
                    }}
                    label="Old"
                    required
                  />
                  <TextField
                    variant="outlined"
                    type="password"
                    onChange={(e) => {
                      setNewPass(e.target.value);
                    }}
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
