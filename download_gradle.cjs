const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Downloading gradle-8.7-bin.zip...');
  execSync('curl -L -o gradle-8.7-bin.zip https://services.gradle.org/distributions/gradle-8.7-bin.zip', { stdio: 'inherit' });
  
  console.log('Unzipping...');
  execSync('unzip -q -o gradle-8.7-bin.zip', { stdio: 'inherit' });
  
  console.log('Copying wrapper jar...');
  const wrapperPath = 'gradle-8.7/lib/plugins/gradle-wrapper-8.7.jar';
  console.log('Using wrapper at: ' + wrapperPath);
  
  if (wrapperPath) {
    fs.mkdirSync('android/gradle/wrapper', { recursive: true });
    fs.copyFileSync(wrapperPath, 'android/gradle/wrapper/gradle-wrapper.jar');
  } else {
    console.error('Wrapper jar not found!');
  }
  
  console.log('Copying gradlew scripts...');
  fs.copyFileSync('gradle-8.7/bin/gradlew', 'android/gradlew');
  fs.copyFileSync('gradle-8.7/bin/gradlew.bat', 'android/gradlew.bat');
  
  console.log('Setting permissions...');
  fs.chmodSync('android/gradlew', 0o755);
  
  console.log('Cleaning up...');
  execSync('rm -rf gradle-8.7 gradle-8.7-bin.zip', { stdio: 'inherit' });
  
  console.log('Done.');
} catch (e) {
  console.error(e);
  process.exit(1);
}
