const { execSync } = require('child_process');
try {
  execSync('./android/gradlew clean --no-daemon', { cwd: process.cwd(), stdio: 'inherit' });
} catch (e) {
  console.error(e);
}
