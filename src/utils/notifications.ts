export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("Notifications non supportées.");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
}

export async function scheduleBackupReminder() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) return;

    // Check permissions
    if (Notification.permission !== "granted") return;

    const now = new Date();
    // Schedule for 2 hours from now
    const targetTime = now.getTime() + 2 * 60 * 60 * 1000;

    // @ts-ignore
    if ('showTrigger' in Notification.prototype && window.TimestampTrigger) {
      try {
        registration.showNotification("Sauvegarde recommandée 💾", {
          tag: 'backup-reminder',
          body: "Vous avez des modifications non sauvegardées. Pensez à exporter vos données.",
          icon: '/icon.png',
          data: { url: '/?tab=settings' },
          // @ts-ignore
          showTrigger: new TimestampTrigger(targetTime)
        });
      } catch (e) {
        console.error("Failed to schedule backup notification", e);
      }
    }
  } catch (err) {
    console.error("Error scheduling backup reminder: ", err);
  }
}

export async function scheduleUpcomingNotifications(upcomingTransactions: any[], language: string) {
  
  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) return;

    const permission = await requestNotificationPermission();
    if (!permission) return;

    for (const tx of upcomingTransactions) {
      if (!tx.dayOfMonth) continue;

      const now = new Date();
      let nextDate = new Date(now.getFullYear(), now.getMonth(), tx.dayOfMonth, 9, 0, 0); 
      
      // If the scheduled day for this month has already passed, schedule for next month
      if (now.getDate() > tx.dayOfMonth || (now.getDate() === tx.dayOfMonth && now.getHours() >= 9)) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      
      // Only proceed if showTrigger API is supported
      // @ts-ignore
      if ('showTrigger' in Notification.prototype && window.TimestampTrigger) {
        const title = language === "Français" ? "Rappel de Prévue" : language === "العربية" ? "تذكير بالموعد" : "Upcoming Reminder";
        const body = `${tx.label} - ${tx.amount} DH`;
        
        // Emojis mapping for categories
        const emojis: Record<string, string> = {
           "Gourmandises": "🍔",
           "Essentiel": "🌾",
           "Protéines": "🥩",
           "Plantes": "🥕",
           "Transport": "🚌",
           "Logement": "🏠",
           "Loisirs": "🎬",
           "Santé": "⚕️",
           "Éducation": "📚",
           "Factures": "📄",
           "Abonnements": "📱",
           "Salaire": "💰",
           "Dépôt": "🏦",
           "Virement": "🔄",
           "Autres": "📦"
        };
        const emoji = emojis[tx.categoryId] || "💸";

        try {
          registration.showNotification(`${emoji} ${title}`, {
             tag: `upcoming-${tx.id}`,
             body: body,
             icon: '/icon.png',
             badge: '/icon.png',
             data: { url: '/?tab=bank' },
             // @ts-ignore
             showTrigger: new TimestampTrigger(nextDate.getTime())
          });
          console.log(`Notification scheduled for ${tx.label} on ${nextDate.toLocaleString()}`);
        } catch (e) {
          console.error("Failed to schedule notification trigger", e);
        }
      }
    }
  } catch (err) {
    console.error("Error scheduling notifications: ", err);
  }
}
