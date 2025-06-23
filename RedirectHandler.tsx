import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';
import { Typography, Container } from '@mui/material';
import { logAction } from '../middleware/loggingMiddleware';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const { urls, addClick } = useUrlContext();

  useEffect(() => {
    const match = urls.find((u) => u.shortCode === shortcode);
    if (!match) {
      alert("Short URL not found.");
      return;
    }

    const now = new Date();
    const expiry = new Date(match.expiresAt);
    if (now > expiry) {
      alert("This link has expired.");
      return;
    }

    const click = {
      timestamp: now.toISOString(),
      referrer: document.referrer || 'Direct',
      location: 'India (simulated)', // can use IP lookup API if backend allowed
    };

    addClick(shortcode!, click);
    logAction("Short URL Clicked", { shortcode, click });

    setTimeout(() => {
      window.location.href = match.longUrl;
    }, 500); // small delay for UX
  }, [shortcode, urls, addClick]);

  return (
    <Container sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h5">Redirecting you to the original URL...</Typography>
    </Container>
  );
};

export default RedirectHandler;