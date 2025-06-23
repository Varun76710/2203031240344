import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUrlContext } from '../context/UrlContext';

const StatsPage = () => {
  const { urls } = useUrlContext();
  const [allUrls, setAllUrls] = useState(urls);
  const navigate = useNavigate();

  useEffect(() => {
    setAllUrls(urls);
  }, [urls]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>URL Statistics</Typography>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate("/")}>
        ← Back to Shortener
      </Button>
      {allUrls.length === 0 ? (
        <Typography>No URLs shortened yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Total Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUrls.map((u) => (
              <React.Fragment key={u.shortCode}>
                <TableRow>
                  <TableCell>
                    <a href={`/${u.shortCode}`} target="_blank" rel="noreferrer">
                      {window.location.origin}/{u.shortCode}
                    </a>
                  </TableCell>
                  <TableCell>{u.longUrl}</TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{new Date(u.expiresAt).toLocaleString()}</TableCell>
                  <TableCell>{u.clicks.length}</TableCell>
                </TableRow>
                {u.clicks.map((click, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5} sx={{ pl: 4, fontSize: '0.875rem' }}>
                      ↳ {new Date(click.timestamp).toLocaleString()} | {click.referrer} | {click.location || "Unknown"}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

export default StatsPage;