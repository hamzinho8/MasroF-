const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

console.log('Downloading Java...');
const file = fs.createWriteStream('/tmp/java.tar.gz');
https.get('https://download.java.net/java/GA/jdk21.0.2/f2283984656d49d69e91c558476027ac/13/GPL/openjdk-21.0.2_linux-x64_bin.tar.gz', function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Download complete, extracting...');
    execSync('tar -xzf /tmp/java.tar.gz -C /tmp', {stdio: 'inherit'});
    console.log('Extracted. Running gradlew...');
    try {
      execSync('JAVA_HOME=/tmp/jdk-21.0.2 sh ./gradlew clean --no-daemon', { cwd: process.cwd() + '/android', stdio: 'inherit' });
    } catch(e) {
      console.error(e);
    }
  });
});
