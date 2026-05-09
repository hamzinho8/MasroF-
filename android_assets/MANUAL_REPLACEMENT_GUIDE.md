# 📱 Android Asset Replacement Guide (Masrof)

This guide explains how to manually replace your application assets on an Android device or within a project.

## 📁 Folder Structure
Your new assets should be placed as follows:
- `res/drawable/splash_screen.xml` -> Splash Screen Logic
- `res/drawable/logo_splash.png` -> High-res PNG from your SVG
- `res/mipmap-xxxx/ic_launcher.png` -> Your generated icons

## 🛠️ Step-by-Step Manual Replacement (Non-Dev)
If you are using a tool to wrap your web app (like Capacitor, Cordova, or a "Website to APK" converter):

1. **Convert SVG to PNG**:
   - Use high resolution (at least 1024x1024).
   - Keep the transparency.
2. **Splash Screen**:
   - Set the background to hexadecimal: `#05070d`.
   - Scale the logo to occupy roughly 60% of the screen width.
3. **App Icon**:
   - Ensure the logo is centered.
   - For Android 8.0+, use "Adaptive Icons" where the background is `#05070d`.

## 📜 AndroidManifest.xml Update
Ensure your manifest points to the new splash theme:

```xml
<activity
    android:name=".MainActivity"
    android:theme="@style/Theme.App.Starting">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

## 🎨 Design Philosophy Applied
- **Background**: Dark Luxury `#05070d`
- **Primary Color**: Gold/Amber for actions
- **Secondary Color**: Emerald Green for financial success indications
- **Logo**: Used exactly as provided, preserving all gradients and glass effects.
