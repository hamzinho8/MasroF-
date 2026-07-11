import CryptoJS from 'crypto-js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const BACKUP_FILE_NAME = `masrof_backup_latest.dat`;
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

const getBackupData = () => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
            data[key] = window.localStorage.getItem(key);
        }
    }
    const jsonData = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonData, ENCRYPTION_KEY).toString();
};

export const exportDataToFile = async () => {
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
            }
            
            try {
                await Share.share({
                    title: 'Sauvegarde Masrof',
                    text: 'Fichier de sauvegarde des données Masrof.',
                    url: fileUri,
                    dialogTitle: 'Enregistrer la sauvegarde'
                });
            } catch (shareErr: any) {
                console.log('Share prompt failed or was cancelled', shareErr);
                if (shareErr.name !== 'AbortError' && !shareErr.message?.toLowerCase().includes('cancel')) {
                    throw shareErr;
                }
            }
        } else {
            if ('showSaveFilePicker' in window) {
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
            if (navigator.share && navigator.canShare) {
                const file = new File([blob], BACKUP_FILE_NAME, { type: 'application/octet-stream' });
                if (navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Sauvegarde Masrof',
                            text: 'Fichier de sauvegarde des données Masrof.'
                        });
                    } catch (shareErr: any) {
                        if (shareErr.name !== 'AbortError' && !shareErr.message?.toLowerCase().includes('cancel')) {
                            throw shareErr;
                        }
                    }
                } else {
                    forceBlobDownload(blob);
                }
            } else {
                forceBlobDownload(blob);
            }
        }
        }
        localStorage.setItem('lastBackupTimestamp', Date.now().toString());
        localStorage.setItem('hasUnbackedChanges', 'false');
    } catch (e: any) {
        console.error('Failed to export data', e);
        if (e && (e.name === 'AbortError' || (e.message && (e.message.toLowerCase().includes('cancel') || e.message.toLowerCase().includes('abort'))))) {
            // Log ignored cancel error
            console.log('User cancelled share');
        } else {
            alert("Erreur lors de la création de la sauvegarde. (" + (e?.message || JSON.stringify(e)) + ")");
        }
    }
};

const forceBlobDownload = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = BACKUP_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const autoBackup = async () => {
    try {
        const encryptedData = getBackupData();
        if (Capacitor.isNativePlatform()) {
            try {
                await Filesystem.writeFile({
                    path: BACKUP_FILE_NAME,
                    data: encryptedData,
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8,
                });
                console.log('Auto-backup to Documents completed successfully.');
            } catch(e) {
                // Silently fallback to internal data if Documents is unavailable/no permission
                await Filesystem.writeFile({
                    path: BACKUP_FILE_NAME,
                    data: encryptedData,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });
                console.log('Auto-backup to internal Data completed.');
            }
        } else {
            window.localStorage.setItem('web_auto_backup', encryptedData);
        }
    } catch (e) {
        console.error('Failed to auto backup data', e);
    }
};

export const importDataFromFile = async (): Promise<boolean> => {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.dat,application/octet-stream';
        
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) {
                resolve(false);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const result = event.target?.result as string;
                    const decryptedBytes = CryptoJS.AES.decrypt(result, ENCRYPTION_KEY);
                    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
                    
                    if (!decryptedString) {
                        alert("Le fichier de sauvegarde est invalide, corrompu, ou a été créé avec une ancienne clé.");
                        resolve(false);
                        return;
                    }

                    const data = JSON.parse(decryptedString) as Record<string, string | null>;
                    for (const key in data) {
                        const val = data[key];
                        if (val !== null) {
                            window.localStorage.setItem(key, val);
                        }
                    }
                    resolve(true);
                } catch (err) {
                    console.error('Failed to decrypt data', err);
                    alert("Impossible de lire ce fichier de sauvegarde.");
                    resolve(false);
                }
            };
            
            reader.onerror = () => {
                alert("Erreur lors de la lecture du fichier.");
                resolve(false);
            };

            reader.readAsText(file);
        };
        
        input.onerror = () => {
             resolve(false);
        };
        
        // Trigger file picker
        input.click();
    });
};

