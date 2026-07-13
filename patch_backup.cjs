const fs = require('fs');
const file = 'src/utils/backup.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `        } else {
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
        }`;

const replacement = `        } else {
            const handle = await getHandle();
            if (handle && 'showSaveFilePicker' in window) {
                const options = { mode: 'readwrite' };
                if ((await handle.queryPermission(options)) !== 'granted') {
                    const permission = await handle.requestPermission(options);
                    if (permission !== 'granted') {
                        await exportDataToFile();
                        return true;
                    }
                }
                const writable = await handle.createWritable();
                await writable.write(encryptedData);
                await writable.close();
                localStorage.setItem('lastBackupTimestamp', Date.now().toString());
                localStorage.setItem('hasUnbackedChanges', 'false');
                return true;
            }
            await exportDataToFile();
            return true;
        }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log('Patched successfully');
} else {
    console.log('Target not found');
}
