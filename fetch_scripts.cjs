const fs = require('fs');
const https = require('https');

const VERSION = '8.7.0';
const FILES = [
  {
    url: `https://raw.githubusercontent.com/gradle/gradle/v${VERSION}/gradlew`,
    dest: 'android/gradlew',
  },
  {
    url: `https://raw.githubusercontent.com/gradle/gradle/v${VERSION}/gradlew.bat`,
    dest: 'android/gradlew.bat',
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const file of FILES) {
    await downloadFile(file.url, file.dest);
    if (file.dest.endsWith('gradlew')) {
      fs.chmodSync(file.dest, 0o755);
    }
  }
  
  // Create wrapper properties
  const props = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`;
  fs.writeFileSync('android/gradle/wrapper/gradle-wrapper.properties', props);
  console.log('Done downloading scripts and writing properties.');
}

main().catch(console.error);
