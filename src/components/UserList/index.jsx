import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      fetchModel("/user/list"),
      fetchModel("/user/counts"),
    ])
      .then(([userData, countData]) => {
        setUsers(userData);
        const countMap = {};
        countData.forEach((c) => { countMap[c._id] = c; });
        setCounts(countMap);
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
      <Typography variant="h6" sx={{ p: 1, fontWeight: "bold" }}>
        Users
      </Typography>
      <Divider />
      <List component="nav" dense disablePadding>
        {users.map((user) => {
          const path = `/users/${user._id}`;
          const selected =
            location.pathname === path ||
            location.pathname === `/photos/${user._id}` ||
            location.pathname.startsWith(`/photos/${user._id}/`);
          const userCount = counts[user._id] || { photoCount: 0, commentCount: 0 };

          return (
            <React.Fragment key={user._id}>
              <ListItemButton
                selected={selected}
                onClick={() => navigate(path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd",
                    "&:hover": { backgroundColor: "#bbdefb" },
                  },
                }}
              >
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  primaryTypographyProps={{ fontWeight: selected ? "bold" : "normal" }}
                />
                <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                  {/* Green: photo count */}
                  <Chip
                    label={userCount.photoCount}
                    size="small"
                    sx={{ bgcolor: "#4caf50", color: "white", height: 20, fontSize: "0.7rem" }}
                  />
                  {/* Red: comment count - clickable */}
                  <Chip
                    label={userCount.commentCount}
                    size="small"
                    sx={{ bgcolor: "#f44336", color: "white", height: 20, fontSize: "0.7rem", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/comments/${user._id}`);
                    }}
                  />
                </Box>
              </ListItemButton>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
