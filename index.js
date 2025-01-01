import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  try {
    // Read the head.html file from the root directory
    fs.readFile(path.join(process.cwd(), 'head.html'), 'utf8', (err, data) => {
      if (err) {
        res.status(404).send('head.html not found');
        return;
      }

      // Inject the VERCEL_URL environment variable into the HTML
      const injectedHtml = data.replace('{{VERCEL_URL}}', process.env.VERCEL_URL);

      // Send the modified HTML back to the client
      res.status(200).send(injectedHtml);
    });
  } catch (error) {
    res.status(500).send('Server Error');
  }
};
