import { AccountCircle, ModeEdit, Error } from "@mui/icons-material";
import {
  Box,
  Card,
  Button,
  TextField,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  Slide,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { API_BASE, fetcher } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Account Deletion Dialog Animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Account Deletion Dialog
const SimpleDialog = (props) => {
  const { onDelete, open, progress } = props;

  const handleCancel = () => {
    onDelete(true);
  };

  const handleDelete = (event) => {
    if (event.target.id === "conf-del") onDelete(false);
  };

  return (
    <Dialog
      onClose={handleCancel}
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          borderRadius: "15px",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "space-between",
          fontSize: "1.5em",
        }}
      >
        <Error
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            alignSelf: "center",
            fontSize: "3em",
            backgroundColor: "red",
            padding: "7.5%",
            borderRadius: "100%",
          }}
        />
        <br />
        &nbsp; Your account will be deleted in
      </DialogTitle>
      <p
        style={{
          textAlign: "center",
          fontSize: "2em",
          color: "white",
          background: "rgba(255, 0, 0, 0.5)",
          width: "3em",
          alignSelf: "center",
          borderRadius: "20px",
        }}
      >
        {progress / 10}
      </p>
      <p style={{ textAlign: "center", color: "rgb(100, 100, 100)" }}>
        You cannot undo this!
      </p>
      <Box style={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          id="conf-del"
          variant="contained"
          style={{
            backgroundColor: "red",
            marginLeft: "5%",
            marginBottom: "5%",
            height: "20%",
            width: "40%",
          }}
          onClick={handleDelete}
        >
          I'm Sure
        </Button>
        <Button
          id="cancel-del"
          variant="contained"
          style={{
            backgroundColor: "rgba(128, 128, 128, 0.25)",
            color: "black",
            marginRight: "5%",
            marginBottom: "5%",
            height: "20%",
            width: "40%",
          }}
          onClick={handleCancel}
        >
          My Bad
        </Button>
      </Box>
    </Dialog>
  );
};

// Account Deletion Dialog props
SimpleDialog.propTypes = {
  onDelete: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
};

export default function Profile() {
  const { token } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditName, setIsEditName] = useState(false);
  const [isEditMail, setIsEditMail] = useState(false);
  const [isEditPass, setIsEditPass] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [isEmpty, setIsEmpty] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [progress, setProgress] = useState(300);
  const { enqueueSnackbar } = useSnackbar();

  const { data, error, mutate } = useSWR(["/profile", token], fetcher);
  const navigate = useNavigate();

  React.useEffect(() => {
    setFirstName(data?.data?.firstName || "");
    setLastName(data?.data?.lastName || "");

    // Account Deletion Timer
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (isSure) {
          if (oldProgress === 0) {
            handleDelete(false);
            return 0;
          }
          return Math.max(oldProgress - 10, 0);
        } else return 300;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [data, isSure]);

  if (error) {
    enqueueSnackbar(error.message, { variant: "error" });
    return <></>;
  }
  if (!data) {
    return <LinearProgress />;
  }
  const oldEmail = data.data.email;

  const handleDelete = (canceled) => {
    if (!canceled && isDelete) {
      fetch(`${API_BASE}/deleteAccount/profile`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: token },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status !== "error") {
            mutate();
            navigate("/login");
          }
        });
    } else {
      setIsSure(!isSure);
    }
    setIsDelete(!isDelete);
  };

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
          if (!isEditing) enqueueSnackbar(res.message, { variant: "error" });
        } else {
          enqueueSnackbar("Successfully changed name", { variant: "success" });
          mutate();
        }
      });
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
          if (!isEditing) enqueueSnackbar(res.message, { variant: "error" });
        } else {
          enqueueSnackbar("Successfully changed email", { variant: "success" });
          mutate();
        }
      });
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
          if (!isEditing) enqueueSnackbar(res.message, { variant: "error" });
        } else {
          enqueueSnackbar("Successfully changed password", {
            variant: "success",
          });
        }
      });
  };

  return (
    <div>
      {isEmpty && (isEditing || isEditName || isEditMail || isEditPass) && (
        <Alert severity="warning">Please fill the required information</Alert>
      )}
      <Box className="Acc-box">
        <Card
          className="Acc-card"
          sx={{ borderRadius: "15px", boxShadow: "none" }}
        >
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            {/* {progress} */}
            <AccountCircle id="Acc-pic" />
            <SimpleDialog
              open={isDelete}
              onDelete={handleDelete}
              progress={progress}
            />
            {isEditing ? (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  maxWidth: "70%",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    marginTop: "10%",
                    backgroundColor: "red",
                    marginRight: "5%",
                    height: "20%",
                    width: "200px",
                    transform: "translate(0, 325%)",
                  }}
                  onClick={() => {
                    setIsSure(true);
                    setIsDelete(true);
                  }}
                >
                  Delete Acccount
                </Button>
                <Button
                  variant="contained"
                  id="unedit-button"
                  style={{
                    height: "20%",
                    marginTop: "10%",
                    transform: "translate(0, 325%)",
                  }}
                  onClick={handleMainEdit}
                >
                  Done
                </Button>
              </Box>
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
