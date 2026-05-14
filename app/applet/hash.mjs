import fs from 'node:fs';
import crypto from 'node:crypto';

const dest = './android/gradle/wrapper/gradle-wrapper.jar';
const hash = crypto.createHash('sha256');
const stream = fs.createReadStream(dest);
stream.on('data', data => hash.update(data));
stream.on('end', () => {
    const sha256 = hash.digest('hex');
    console.log('SHA256:', sha256);
});
