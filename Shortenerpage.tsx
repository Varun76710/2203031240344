import React, { useState } from 'react';
import {
  Container, Typography, Button, Card, Grid, TextField, Snackbar, Alert
} from '@mui/material';
import { generateShortcode } from '../utils/shortener';
import { isValidUrl, isValidInteger, isValidShortcode } from '../utils/validation';
import { useUrlContext } from '../context/UrlContext';
import { logAction } from '../middleware/loggingMiddleware';
import { useNavigate } from 'react-router-dom';

const ShortenerPage = () => {
  const [forms, setForms] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [snackbar, setSnackbar] = useState('');
  const [successLinks, setSuccessLinks] = useState<string[]>([]);
  const { urls, addUrl } = useUrlContext();
  const navigate = useNavigate();

  const handleInputChange = (index: number, field: string, value: string) => {
    const updated = [...forms];
    (updated[index] as any)[field] = value;
    setForms(updated);
  };

  const handleAddForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = () => {
    const existingCodes = new Set(urls.map(u => u.shortCode));
    const results: string[] = [];

    for (const form of forms) {
      const { longUrl, validity, shortcode } = form;

      if (!isValidUrl(longUrl)) {
        setSnackbar('Invalid URL format');
        return;
      }

      if (validity && !isValidInteger(validity)) {
        setSnackbar('Validity must be an integer');
        return;
      }

      let finalCode = shortcode || generateShortcode(existingCodes);
      if (shortcode) {
        if (!isValidShortcode(shortcode)) {
          setSnackbar('Shortcode must be alphanumeric and ≤ 10 characters');
          return;
        }
        if (existingCodes.has(shortcode)) {
          setSnackbar(`Shortcode "${shortcode}" is already taken`);
          return;
        }
      }

      const createdAt = new Date().toISOString();
      const expiresAt = new Date(
        Date.now() + (parseInt(validity || '30') * 60 * 1000)
      ).toISOString();

      const newRecord = {
        longUrl,
        shortCode: finalCode,
        createdAt,
        expiresAt,
        clicks: []
      };

      addUrl(newRecord);
      logAction('URL Created', newRecord);
      existingCodes.add(finalCode);

      results.push(`${window.location.origin}/${finalCode}`);
    }

    setSuccessLinks(results);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>

      {forms.map((form, i) => (
        <Card key={i} sx={{ mb: 2, p: 2 }}>
          <TextField
            label="Long URL"
            fullWidth
            margin="normal"
            value={form.longUrl}
            onChange={(e) => handleInputChange(i, 'longUrl', e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Validity (in minutes)"
                fullWidth
                value={form.validity}
                onChange={(e) => handleInputChange(i, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Custom Shortcode (optional)"
                fullWidth
                value={form.shortcode}
                onChange={(e) => handleInputChange(i, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Card>
      ))}

      {forms.length < 5 && (
        <Button variant="outlined" onClick={handleAddForm} sx={{ mb: 2 }}>
          Add Another URL
        </Button>
      )}

      <Button variant="contained" onClick={handleSubmit}>
        Shorten URLs
      </Button>

      {successLinks.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>Generated Short URLs:</Typography>
          {successLinks.map((link, index) => (
            <Typography key={index}><a href={link}>{link}</a></Typography>
          ))}
          <Button sx={{ mt: 2 }} onClick={() => navigate('/stats')}>Go to Stats Page</Button>
        </>
      )}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar('')}
      >
        <Alert severity="error">{snackbar}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ShortenerPage;