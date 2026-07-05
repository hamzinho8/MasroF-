import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. syncNotifications wrapper
content = content.replace(`  useEffect(() => {
    async function syncNotifications() {`, `  useEffect(() => {
    const timer = setTimeout(() => {
      async function syncNotifications() {`);

content = content.replace(`    syncNotifications();

    if (Capacitor.isNativePlatform()) {
      let listenerRemoved = false;
      const listener = LocalNotifications.addListener(
        "localNotificationReceived",
        (notification) => {
          // Do anything else needed
        }
      );
      return () => {
        listenerRemoved = true;
        listener.then((l) => l.remove()).catch(() => {});
      };
    }
  }, [reminders]);`, `    syncNotifications();

    if (Capacitor.isNativePlatform()) {
      let listenerRemoved = false;
      const listener = LocalNotifications.addListener(
        "localNotificationReceived",
        (notification) => {
          // Do anything else needed
        }
      );
    }
    }, 2000);
    return () => clearTimeout(timer);
  }, [reminders]);`);

// 2. Migration wrapper
content = content.replace(`  React.useEffect(() => {
    let migrated = false;
    const newTransactions = transactions.map(tx => {`, `  React.useEffect(() => {
    const timer = setTimeout(() => {
    let migrated = false;
    const newTransactions = transactions.map(tx => {`);

content = content.replace(`    if (migrated) {
      setTransactions(newTransactions);
    }
  }, [transactions, setTransactions]);`, `    if (migrated) {
      setTransactions(newTransactions);
    }
    }, 3000);
    return () => clearTimeout(timer);
  }, [transactions, setTransactions]);`);

// 3. categoryTotals wrapper (Effect 4)
content = content.replace(`  React.useEffect(() => {
    // 4. Category Budget >= 90%
    const now = new Date();`, `  React.useEffect(() => {
    const timer = setTimeout(() => {
    // 4. Category Budget >= 90%
    const now = new Date();`);

content = content.replace(`      } else if (
        budgetAlertThreshold !== null &&
        total < limitNum * budgetThresholdRatio
      ) {
        alertedCategoriesRef.current[cat] = false;
      }
    });
  }, [transactions, categoryBudgets, currency, budgetAlertThreshold]);`, `      } else if (
        budgetAlertThreshold !== null &&
        total < limitNum * budgetThresholdRatio
      ) {
        alertedCategoriesRef.current[cat] = false;
      }
    });
    }, 1500);
    return () => clearTimeout(timer);
  }, [transactions, categoryBudgets, currency, budgetAlertThreshold]);`);


// 4. Aggregate inventory wrapper (Shopping list effect)
content = content.replace(`  React.useEffect(() => {
    setShoppingList(prevList => {`, `  React.useEffect(() => {
    const timer = setTimeout(() => {
    setShoppingList(prevList => {`);

content = content.replace(`      return hasChanges ? newShoppingList : prevList;
    });
  }, [inventoryItems, setShoppingList]);`, `      return hasChanges ? newShoppingList : prevList;
    });
    }, 1500);
    return () => clearTimeout(timer);
  }, [inventoryItems, setShoppingList]);`);

// 5. Native widget and balances
content = content.replace(`  React.useEffect(() => {
    if (
      balanceThreshold !== null &&
      balance < balanceThreshold &&
      prevBalanceRef.current >= balanceThreshold
    ) {`, `  React.useEffect(() => {
    const timer = setTimeout(() => {
    if (
      balanceThreshold !== null &&
      balance < balanceThreshold &&
      prevBalanceRef.current >= balanceThreshold
    ) {`);

content = content.replace(`        alarms.push(
          ` + '`<b><font color="${warnColor}">📦 Il ne vous reste que ${inventoryAlertThreshold} article(s) de "${item.name}".</font></b>`' + `
        );
      });

      if (alarms.length > 0) {
        await Preferences.set({
          key: "widget_alarms",
          value: JSON.stringify(alarms),
        });
      } else {
        await Preferences.remove({ key: "widget_alarms" });
      }

      WidgetUpdater.updateWidget().catch((err: any) =>
        console.log("Widget update skipped or failed", err)
      );
    }

    updateWidget();
  }, [
    balance,
    bankBalance,
    currency,
    transactions,
    inventoryItems,
    widgetTextColor,
    categoryBudgets,
    budgetAlertThreshold,
    bankBalanceThreshold,
    balanceThreshold,
    inventoryAlertThreshold,
    bankBalanceCustomMessage,
    balanceCustomMessage,
  ]);`, `        alarms.push(
          ` + '`<b><font color="${warnColor}">📦 Il ne vous reste que ${inventoryAlertThreshold} article(s) de "${item.name}".</font></b>`' + `
        );
      });

      if (alarms.length > 0) {
        await Preferences.set({
          key: "widget_alarms",
          value: JSON.stringify(alarms),
        });
      } else {
        await Preferences.remove({ key: "widget_alarms" });
      }

      WidgetUpdater.updateWidget().catch((err: any) =>
        console.log("Widget update skipped or failed", err)
      );
    }

    updateWidget();
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    balance,
    bankBalance,
    currency,
    transactions,
    inventoryItems,
    widgetTextColor,
    categoryBudgets,
    budgetAlertThreshold,
    bankBalanceThreshold,
    balanceThreshold,
    inventoryAlertThreshold,
    bankBalanceCustomMessage,
    balanceCustomMessage,
  ]);`);

fs.writeFileSync('src/App.tsx', content);

