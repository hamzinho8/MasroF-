const { execSync } = require('child_process');
try {
  execSync('sh ./android/gradlew clean --no-daemon', { cwd: process.cwd() + '/android', stdio: 'inherit' });
} catch (e) {
  console.error(e);
}
