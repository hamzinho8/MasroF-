const fs = require('fs');
const { execSync } = require('child_process');

console.log('Running gradlew directly...');
try {
  execSync('chmod +x ./gradlew', { cwd: process.cwd() + '/android', stdio: 'inherit' });
  execSync('JAVA_HOME=/tmp/jdk-21.0.2 ./gradlew clean --no-daemon', { cwd: process.cwd() + '/android', stdio: 'inherit' });
} catch(e) {
  console.error(e);
}
