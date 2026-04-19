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
  Chip,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useParams, useNavigate, Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserPhotos({ setContext, advancedFeatures }) {
  const { userId, photoIndex } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const currentIndex = photoIndex !== undefined ? parseInt(photoIndex, 10) : 0;

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
    return () => { cancelled = true; };
  }, [userId, setContext]);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;
  if (!photos.length)
    return <Typography sx={{ m: 2 }}>No photos found for this user.</Typography>;

  // ---- Advanced mode: single photo stepper ----
  if (advancedFeatures) {
    if (photoIndex === undefined) {
      navigate(`/photos/${userId}/stepper/0`, { replace: true });
      return null;
    }
    const safeIndex = Math.min(Math.max(currentIndex, 0), photos.length - 1);
    const photo = photos[safeIndex];

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Photos of {userName}
          </Typography>
          <Chip label={`${safeIndex + 1} / ${photos.length}`} size="small" color="primary" />
        </Box>

        {/* Stepper controls on top */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<ArrowBackIosNewIcon />}
            disabled={safeIndex === 0}
            onClick={() => navigate(`/photos/${userId}/stepper/${safeIndex - 1}`)}
            size="small"
          >
            Previous
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIosIcon />}
            disabled={safeIndex === photos.length - 1}
            onClick={() => navigate(`/photos/${userId}/stepper/${safeIndex + 1}`)}
            size="small"
          >
            Next
          </Button>
        </Box>

        <PhotoCard photo={photo} />
      </Box>
    );
  }

  // ---- Normal mode: all photos ----
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Photos of {userName}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </Box>
  );
}

function PhotoCard({ photo }) {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardMedia
        component="img"
        image={`http://localhost:3002/images/${photo.file_name}`}
        alt={photo.file_name}
        sx={{ maxHeight: 420, objectFit: "contain", bgcolor: "#f5f5f5" }}
        onError={(e) => {
          e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
        }}
      />
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {formatDate(photo.date_time)}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <ChatBubbleOutlineIcon fontSize="small" color="action" />
            <Typography variant="subtitle2">
              {photo.comments && photo.comments.length > 0
                ? `${photo.comments.length} Comment${photo.comments.length > 1 ? "s" : ""}`
                : "No comments"}
            </Typography>
          </Box>

          {photo.comments && photo.comments.length > 0 && (
            <>
              <Divider sx={{ mb: 1 }} />
              {photo.comments.map((c) => (
                <Paper
                  key={c._id}
                  variant="outlined"
                  sx={{ p: 1.5, mb: 1, bgcolor: "#fafafa" }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                    <Link
                      to={`/users/${c.user._id}`}
                      style={{ fontWeight: "bold", textDecoration: "none", color: "#1976d2" }}
                    >
                      {c.user.first_name} {c.user.last_name}
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(c.date_time)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{c.comment}</Typography>
                </Paper>
              ))}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default UserPhotos;
