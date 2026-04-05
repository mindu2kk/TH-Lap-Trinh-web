import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * UserList - Sidebar navigation listing all users.
 * Clicking a user name navigates to their UserDetail page.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModel("/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("UserList fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress sx={{ m: 2 }} />;
  }

  return (
    <div>
      <Typography variant="h6" sx={{ p: 1 }}>
        Users
      </Typography>
      <Divider />
      <List component="nav" dense>
        {users.map((user) => (
          <React.Fragment key={user._id}>
            <ListItemButton component={Link} to={`/users/${user._id}`}>
              <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
              />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
