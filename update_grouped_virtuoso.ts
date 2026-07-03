import fs from 'fs';
let content = fs.readFileSync('src/components/History.tsx', 'utf-8');

const groupingLogic = `  // Group transactions by date
  const groupedData = React.useMemo(() => {
    const groups: { date: string, transactions: Transaction[] }[] = [];
    const groupMap = new Map<string, Transaction[]>();
    
    filteredTransactions.forEach(tx => {
      const dateStr = tx.date.split(' ')[0];
      if (!groupMap.has(dateStr)) {
        groupMap.set(dateStr, []);
      }
      groupMap.get(dateStr)!.push(tx);
    });
    
    groupMap.forEach((txs, date) => {
      groups.push({ date, transactions: txs });
    });
    
    return groups;
  }, [filteredTransactions]);

  const groupCounts = React.useMemo(() => groupedData.map(g => g.transactions.length), [groupedData]);
  const flatTransactions = React.useMemo(() => groupedData.flatMap(g => g.transactions), [groupedData]);

`;

// insert before clearDateRange
content = content.replace(/const clearDateRange = \(\) => \{/, groupingLogic + '  const clearDateRange = () => {');

// We also need to add handleSelectAll, handleSelectTx, handleDeleteSelected
const actionsLogic = `  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
  };

  const handleSelectTx = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map(tx => tx.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(\`Voulez-vous vraiment supprimer ces \${selectedIds.size} transactions ?\`)) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    }
  };

`;

content = content.replace(/const clearDateRange = \(\) => \{/, actionsLogic + '  const clearDateRange = () => {');

fs.writeFileSync('src/components/History.tsx', content);
