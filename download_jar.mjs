import fs from 'node:fs';
import https from 'node:https';

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
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
