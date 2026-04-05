import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * UserDetail - Displays detailed info for a single user.
 * Receives setContext to update the TopBar.
 */
function UserDetail({ setContext }) {
  const { userId } = useParams();
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
    return () => {
      cancelled = true;
    };
  }, [userId, setContext]);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (!user)
    return <Typography sx={{ m: 2 }}>User not found.</Typography>;

  return (
    <Card variant="outlined" sx={{ m: 1 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="body1">
          <strong>Location:</strong> {user.location}
        </Typography>
        <Typography variant="body1">
          <strong>Occupation:</strong> {user.occupation}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>About:</strong> {user.description}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={`/photos/${user._id}`}
          sx={{ mt: 2 }}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
