const fs = require('fs');
const content = fs.readFileSync('src/utils/backup.ts', 'utf8');

const targetContent = `import CryptoJS from 'crypto-js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const BACKUP_FILE_NAME = \`masrof_backup_latest.dat\`;
const ENCRYPTION_KEY = 'budget-app-secure-backup-key-2024'; 

const getBackupData = () => {`;

const newContent = `import CryptoJS from 'crypto-js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const BACKUP_FILE_NAME = \`masrof_backup_latest.dat\`;
const ENCRYPTION_KEY = 'budget-app-secure-backup-key-2024'; 

const DB_NAME = 'MasrofBackupDB';
const STORE_NAME = 'handles';

const getDb = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e: any) => {
            e.target.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = (e: any) => resolve(e.target.result);
        request.onerror = (e: any) => reject(e.target.error);
    });
};

const setHandle = async (handle: any) => {
    const db = await getDb();
    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(handle, "backupFileHandle");
        tx.oncomplete = () => resolve();
        tx.onerror = (e: any) => reject(e.target.error);
    });
};

export const getHandle = async (): Promise<any> => {
    try {
        const db = await getDb();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const request = tx.objectStore(STORE_NAME).get("backupFileHandle");
            request.onsuccess = (e: any) => resolve(e.target.result);
            request.onerror = (e: any) => reject(e.target.error);
        });
    } catch (e) {
        return null;
    }
};

export const quickLocalBackup = async (): Promise<boolean> => {
    try {
        const encryptedData = getBackupData();
        if (Capacitor.isNativePlatform()) {
            await Filesystem.writeFile({
                path: BACKUP_FILE_NAME,
                data: encryptedData,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            localStorage.setItem('lastBackupTimestamp', Date.now().toString());
            localStorage.setItem('hasUnbackedChanges', 'false');
            return true;
        } else {
            const handle = await getHandle();
            if (handle) {
                const options = { mode: 'readwrite' };
                if ((await handle.queryPermission(options)) !== 'granted') {
                    const permission = await handle.requestPermission(options);
                    if (permission !== 'granted') {
                        return false;
                    }
                }
                const writable = await handle.createWritable();
                await writable.write(encryptedData);
                await writable.close();
                localStorage.setItem('lastBackupTimestamp', Date.now().toString());
                localStorage.setItem('hasUnbackedChanges', 'false');
                return true;
            }
            return false;
        }
    } catch (e) {
        console.error('Quick backup failed', e);
        return false;
    }
};

const getBackupData = () => {`;

const replaced1 = content.replace(targetContent, newContent);

const exportTarget = `export const exportDataToFile = async () => {
    try {
        const encryptedData = getBackupData();
        if (Capacitor.isNativePlatform()) {
            let fileUri = '';
            try {
                // Try to write to Cache first, as it doesn't require extra permissions on most Android versions
                const writeResult = await Filesystem.writeFile({
                    path: BACKUP_FILE_NAME,
                    data: encryptedData,
                    directory: Directory.Cache,
                    encoding: Encoding.UTF8,
                });
                fileUri = writeResult.uri;
            } catch (cacheErr: any) {
                // Fallback to Data directory
                const writeResult = await Filesystem.writeFile({
                    path: BACKUP_FILE_NAME,
                    data: encryptedData,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });
                fileUri = writeResult.uri;
            }`;

const exportNew = `export const exportDataToFile = async () => {
    try {
        const encryptedData = getBackupData();
        if (Capacitor.isNativePlatform()) {
            let fileUri = '';
            try {
                const writeResult = await Filesystem.writeFile({
                    path: BACKUP_FILE_NAME,
                    data: encryptedData,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                });
                fileUri = writeResult.uri;
            } catch (docErr: any) {
                try {
                    const writeResult = await Filesystem.writeFile({
                        path: BACKUP_FILE_NAME,
                        data: encryptedData,
                        directory: Directory.Cache,
                        encoding: Encoding.UTF8,
                    });
                    fileUri = writeResult.uri;
                } catch (cacheErr: any) {
                    const writeResult = await Filesystem.writeFile({
                        path: BACKUP_FILE_NAME,
                        data: encryptedData,
                        directory: Directory.Data,
                        encoding: Encoding.UTF8,
                    });
                    fileUri = writeResult.uri;
                }
            }`;

const replaced2 = replaced1.replace(exportTarget, exportNew);

const showSavePickerTarget = `            const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
            // For PWA or mobile web preview where Blob download might fail
            if (navigator.share && navigator.canShare) {`;

const showSavePickerNew = `            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await (window as any).showSaveFilePicker({
                        suggestedName: BACKUP_FILE_NAME,
                        types: [{
                            description: 'Fichier de sauvegarde Masrof',
                            accept: { 'application/octet-stream': ['.dat'] },
                        }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write(encryptedData);
                    await writable.close();
                    await setHandle(handle);
                } catch (e: any) {
                    if (e.name !== 'AbortError') throw e;
                    return; // user cancelled
                }
            } else {
            const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
            // For PWA or mobile web preview where Blob download might fail
            if (navigator.share && navigator.canShare) {`;

const finalContent = replaced2.replace(showSavePickerTarget, showSavePickerNew).replace('forceBlobDownload(blob);\n            }\n        }', 'forceBlobDownload(blob);\n            }\n        }\n        }');

fs.writeFileSync('src/utils/backup.ts', finalContent);
console.log('Successfully patched backup.ts');
