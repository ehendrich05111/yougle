import { AccountCircle, ModeEdit } from "@mui/icons-material";
import { Box, Card, Button, TextField, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_BASE } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

// TODO: Add toast error messages
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
  const [oldEmail, setOldEmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [isEmpty, setIsEmpty] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // TODO: make this useSWR
  const fetchUserInfo = React.useCallback(() => {
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
        setOldEmail(res.data.email);
      });
  }, [token]);

  useEffect(() => {
    if (!(firstName && lastName && oldEmail) || isSubmitted) {
      fetchUserInfo();
      setIsSubmitted(false);
    }
  }, [firstName, lastName, oldEmail, isSubmitted, fetchUserInfo]);

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
    if (!isEmpty) {
      if (isEditName || isEditing) submitName();
    }
    setIsEditName(!isEditName);
  };

  const handleMailEdit = () => {
    if (!isEmpty && oldEmail !== email && email) {
      if (isEditMail || isEditing) submitMail();
    }
    setIsEditMail(!isEditMail);
  };

  const handlePassEdit = () => {
    if (!isEmpty) {
      if (isEditPass || isEditing) submitPass();
    }
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
          setErrorMsg(res.message);
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
          setErrorMsg(res.message);
        } else {
          setOldEmail(email);
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
          setErrorMsg(res.message);
        }
      });
    setIsSubmitted(true);
  };

  return (
    <div>
      {isEmpty && (isEditing || isEditName || isEditMail || isEditPass) && (
        <Alert severity="warning">Please fill the required information</Alert>
      )}
      {errorMsg && <Alert severity="warning">{errorMsg}</Alert>}
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
                style={{ marginTop: "10%", transform: "translate(0, 200%)" }}
                onClick={handleMainEdit}
              >
                {isEmpty ? "Done" : "Back"}
              </Button>
            ) : (
              <Button
                variant="contained"
                id="edit-button"
                style={{ marginTop: "10%", transform: "translate(0, 200%)" }}
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
                          {!isEmpty ? "Done" : "Back"}
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
                  <div
                    className="Row-box"
                    style={{ justifyContent: "space-between" }}
                  >
                    <TextField
                      defaultValue={firstName}
                      variant="outlined"
                      onChange={(e) => {
                        if (!e.target.value) {
                          fetchUserInfo();
                          setIsEmpty(true);
                        } else {
                          setFirstName(e.target.value);
                          setIsEmpty(false);
                        }
                      }}
                      sx={{ width: "45%" }}
                      label="First"
                      required
                    />
                    <TextField
                      defaultValue={lastName}
                      variant="outlined"
                      onChange={(e) => {
                        if (!e.target.value) {
                          fetchUserInfo();
                          setIsEmpty(true);
                        } else {
                          setLastName(e.target.value);
                          setIsEmpty(false);
                        }
                      }}
                      sx={{ width: "45%" }}
                      label="Last"
                      required
                    />
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
                          {!isEmpty || oldEmail === email ? "Done" : "Back"}
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
                      defaultValue={oldEmail}
                      onChange={(e) => {
                        if (!e.target.value) {
                          fetchUserInfo();
                          setIsEmpty(true);
                        } else {
                          setEmail(e.target.value);
                          setIsEmpty(false);
                        }
                      }}
                      style={{ width: "100%" }}
                      required
                    />
                  </div>
                ) : (
                  <div> {oldEmail} </div>
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
                          {!isEmpty ? "Done" : "Back"}
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
                  <div
                    className="Row-box"
                    style={{ justifyContent: "space-between" }}
                  >
                    <TextField
                      variant="outlined"
                      type="password"
                      onChange={(e) => {
                        if (!e.target.value) setIsEmpty(true);
                        else {
                          setOldPass(e.target.value);
                          setIsEmpty(false);
                        }
                      }}
                      sx={{ width: "45%" }}
                      label="Old"
                      required
                    />
                    <TextField
                      variant="outlined"
                      type="password"
                      onChange={(e) => {
                        if (!e.target.value) setIsEmpty(true);
                        else {
                          setNewPass(e.target.value);
                          setIsEmpty(false);
                        }
                      }}
                      sx={{ width: "45%" }}
                      label="New"
                      required
                    />
                  </div>
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
    </div>
  );
}
