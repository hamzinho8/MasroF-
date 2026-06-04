import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hamza.masrof',
  appName: 'Masrof',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_notification",
      iconColor: "#488AFF",
    },
  },
};

export default config;
