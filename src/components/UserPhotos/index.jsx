import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Button,
  Box,
  Paper,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Format an ISO date string into a readable format.
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * UserPhotos - Displays photos for a given user.
 *
 * Normal mode:   Shows all photos with their comments.
 * Advanced mode: Shows one photo at a time with prev/next stepper.
 *                URL is deep-linkable: /photos/:userId/stepper/:photoIndex
 */
function UserPhotos({ setContext, advancedFeatures }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const currentIndex =
    photoIndex !== undefined ? parseInt(photoIndex, 10) : 0;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchModel(`/photosOfUser/${userId}`),
      fetchModel(`/user/${userId}`),
    ])
      .then(([photoData, userData]) => {
        if (cancelled) return;
        setPhotos(photoData);
        const name = `${userData.first_name} ${userData.last_name}`;
        setUserName(name);
        setContext(`Photos of ${name}`);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("UserPhotos fetch error:", err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, setContext]);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (!photos.length)
    return (
      <Typography sx={{ m: 2 }}>No photos found for this user.</Typography>
    );

  // ---- Advanced mode: single photo stepper ----
  if (advancedFeatures) {
    // Redirect /photos/:userId to /photos/:userId/stepper/0 for deep-link consistency
    if (photoIndex === undefined) {
      navigate(`/photos/${userId}/stepper/0`, { replace: true });
      return null;
    }
    const safeIndex = Math.min(Math.max(currentIndex, 0), photos.length - 1);
    const photo = photos[safeIndex];

    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" gutterBottom>
          Photos of {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Photo {safeIndex + 1} of {photos.length}
        </Typography>

        <PhotoCard photo={photo} />

        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosNewIcon />}
            disabled={safeIndex === 0}
            onClick={() =>
              navigate(`/photos/${userId}/stepper/${safeIndex - 1}`)
            }
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIosIcon />}
            disabled={safeIndex === photos.length - 1}
            onClick={() =>
              navigate(`/photos/${userId}/stepper/${safeIndex + 1}`)
            }
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  }

  // ---- Normal mode: all photos ----
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom>
        Photos of {userName}
      </Typography>
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </Box>
  );
}

/**
 * PhotoCard - Renders a single photo with its date and comments.
 */
function PhotoCard({ photo }) {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardMedia
        component="img"
        image={`/images/${photo.file_name}`}
        alt={photo.file_name}
        sx={{ maxHeight: 400, objectFit: "contain", bgcolor: "#f0f0f0" }}
        onError={(e) => {
          e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
        }}
      />
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {formatDate(photo.date_time)}
        </Typography>

        {photo.comments && photo.comments.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Comments ({photo.comments.length})
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {photo.comments.map((c) => (
              <Paper
                key={c._id}
                variant="outlined"
                sx={{ p: 1, mb: 1, bgcolor: "#fafafa" }}
              >
                <Typography variant="body2">
                  <Link
                    to={`/users/${c.user._id}`}
                    style={{ fontWeight: "bold", textDecoration: "none", color: "#1976d2" }}
                  >
                    {c.user.first_name} {c.user.last_name}
                  </Link>
                  <span style={{ color: "#888", fontSize: "0.8em", marginLeft: 8 }}>
                    {formatDate(c.date_time)}
                  </span>
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {c.comment}
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No comments yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default UserPhotos;
