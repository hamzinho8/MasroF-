const { execSync } = require('child_process');

try {
  execSync('JAVA_HOME=/tmp/jdk-21.0.2 /tmp/jdk-21.0.2/bin/java -classpath gradle/wrapper/gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain clean --no-daemon', { cwd: process.cwd() + '/android', stdio: 'inherit' });
} catch(e) {
  console.error(e);
}
