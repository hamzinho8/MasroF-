import { LocalNotifications } from '@capacitor/local-notifications';

export const scheduleBackupReminder = async () => {
    try {
        const enabled = localStorage.getItem('backupReminderEnabled') === 'true';
        const hasUnbackedChanges = localStorage.getItem('hasUnbackedChanges') === 'true';
        
        await LocalNotifications.cancel({ notifications: [{ id: 999 }] });

        if (enabled && hasUnbackedChanges) {
            await LocalNotifications.requestPermissions();
            // Schedule for tomorrow at 20:00 or in 2 hours
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: 'N\'oubliez pas de sauvegarder !',
                        body: 'Vous avez effectué des modifications sans les sauvegarder. Pensez à faire une sauvegarde pour ne rien perdre.',
                        id: 999,
                        schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 2) }, // 2 hours from now
                    }
                ]
            });
        }
    } catch (e) {
        console.error('LocalNotifications error', e);
    }
};
