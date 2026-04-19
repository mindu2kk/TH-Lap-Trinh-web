import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
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

function UserComments({ setContext }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchModel(`/user/comments/${userId}`),
      fetchModel(`/user/${userId}`),
    ])
      .then(([commentData, userData]) => {
        if (cancelled) return;
        setComments(commentData);
        const name = `${userData.first_name} ${userData.last_name}`;
        setUserName(name);
        setContext(`Comments by ${name}`);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("UserComments fetch error:", err);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId, setContext]);

  if (loading) return <CircularProgress sx={{ m: 2 }} />;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Comments by {userName}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {comments.length === 0 ? (
        <Typography color="text.secondary">No comments yet.</Typography>
      ) : (
        comments.map((c) => (
          <Card
            key={c._id}
            variant="outlined"
            sx={{ mb: 2, display: "flex", cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" } }}
            onClick={() => navigate(`/photos/${c.photo._id}`)}
          >
            {/* Thumbnail */}
            <CardMedia
              component="img"
              image={`http://localhost:3002/images/${c.photo.file_name}`}
              alt={c.photo.file_name}
              sx={{ width: 100, height: 100, objectFit: "cover", flexShrink: 0 }}
              onError={(e) => {
                e.target.src = "https://placehold.co/100x100?text=No+Image";
              }}
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(c.date_time)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {c.comment}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserComments;
