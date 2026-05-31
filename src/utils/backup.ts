import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import CryptoJS from 'crypto-js';

const BACKUP_FILE_NAME = 'budget_app_backup.dat';
const ENCRYPTION_KEY = 'budget-app-secure-backup-key-2024'; // In a real app we'd securely generate this on first run and ask user to keep it, but for our simple case we hardcode a static key or derive from device.

export const exportDataToFile = async () => {
    try {
        const data: Record<string, string | null> = {};
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key) {
                data[key] = window.localStorage.getItem(key);
            }
        }

        const jsonData = JSON.stringify(data);
        const encryptedData = CryptoJS.AES.encrypt(jsonData, ENCRYPTION_KEY).toString();

        await Filesystem.writeFile({
            path: BACKUP_FILE_NAME,
            data: encryptedData,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        console.log('Backup successful');
    } catch (e) {
        console.error('Failed to export data', e);
    }
};

export const importDataFromFile = async (): Promise<boolean> => {
    try {
        const result = await Filesystem.readFile({
            path: BACKUP_FILE_NAME,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });

        if (result.data) {
            const decryptedBytes = CryptoJS.AES.decrypt(result.data.toString(), ENCRYPTION_KEY);
            const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedString) {
                console.error("Failed to decrypt data, possibly wrong key or corrupted file.");
                return false; 
            }

            const data = JSON.parse(decryptedString) as Record<string, string | null>;
            for (const key in data) {
                const val = data[key];
                if (val !== null) {
                    window.localStorage.setItem(key, val);
                }
            }
            return true;
        }
    } catch (e: any) {
        if (e?.message?.includes('File does not exist')) {
            console.log('No backup file found, starting fresh.');
        } else {
            console.error('Failed to import data', e);
        }
    }
    return false;
};
