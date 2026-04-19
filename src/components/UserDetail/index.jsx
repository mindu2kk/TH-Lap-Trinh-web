import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
  Avatar,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useParams, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserDetail({ setContext }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchModel(`/user/${userId}`)
      .then((data) => {
        if (cancelled) return;
        setUser(data);
        setContext(`${data.first_name} ${data.last_name}`);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("UserDetail fetch error:", err);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId, setContext]);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (!user) return <Typography sx={{ m: 2 }}>User not found.</Typography>;

  return (
    <Card variant="outlined" sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "#1976d2", fontSize: 28 }}>
            {user.first_name[0]}{user.last_name[0]}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {user.first_name} {user.last_name}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body1">{user.location}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WorkIcon fontSize="small" color="action" />
            <Typography variant="body1">{user.occupation}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mt: 1 }}>
            <PersonIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
            <Typography variant="body1" color="text.secondary">
              {user.description}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<PhotoLibraryIcon />}
          onClick={() => navigate(`/photos/${user._id}`)}
          sx={{ mt: 3 }}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
