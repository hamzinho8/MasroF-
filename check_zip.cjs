const { execSync } = require('child_process');
try {
  const out = execSync('unzip -l gradle-8.7-bin.zip | grep gradlew');
  console.log(out.toString());
} catch (e) {
  console.log(e.toString());
}
