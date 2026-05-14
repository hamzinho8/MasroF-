import fs from 'node:fs';
import https from 'node:https';
import crypto from 'node:crypto';

// Use gradle/gradle official raw github wrapper
// For 8.11.1, the sha256 checksum is eae10e081fbab4043b2fba9b68dccaa9957fc68ff9ff18a1a4574fa0770bd208
const url = 'https://raw.githubusercontent.com/gradle/gradle/v8.11.1/gradle/wrapper/gradle-wrapper.jar';
const dest = './android/gradle/wrapper/gradle-wrapper.jar';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode} ${res.statusMessage}`);
    process.exit(1);
  }
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded successfully');

    // Verify SHA256 matches eae10e081fbab4043b2fba9b68dccaa9957fc68ff9ff18a1a4574fa0770bd208
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(dest);
    stream.on('data', data => hash.update(data));
    stream.on('end', () => {
      const sha256 = hash.digest('hex');
      console.log('SHA256:', sha256);
      if (sha256 !== 'eae10e081fbab4043b2fba9b68dccaa9957fc68ff9ff18a1a4574fa0770bd208') {
        console.error('SHA-256 CHECK FAILED! Expected eae10...0bd208');
        process.exit(1);
      } else {
        console.log('SHA-256 Check Passed!');
      }
    });

  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
