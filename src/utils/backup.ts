import CryptoJS from 'crypto-js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const BACKUP_FILE_NAME = `masrof_backup_latest.dat`;
const ENCRYPTION_KEY = 'budget-app-secure-backup-key-2024'; 

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
            await Filesystem.writeFile({
                path: BACKUP_FILE_NAME,
                data: encryptedData,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            alert(`Sauvegarde réussie dans le dossier Documents sous le nom: ${BACKUP_FILE_NAME}`);
        } else {
            const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = BACKUP_FILE_NAME;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    } catch (e) {
        console.error('Failed to export data', e);
        alert("Erreur lors de la création de la sauvegarde.");
    }
};

export const autoBackup = async () => {
    try {
        const encryptedData = getBackupData();
        if (Capacitor.isNativePlatform()) {
            await Filesystem.writeFile({
                path: BACKUP_FILE_NAME,
                data: encryptedData,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            console.log('Auto-backup completed successfully.');
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

