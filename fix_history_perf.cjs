const fs = require('fs');
let code = fs.readFileSync('src/components/History.tsx', 'utf8');

const regex = /const filteredTransactions = transactions\s*\.filter\([\s\S]*?\.sort\(\(a, b\) => \{[\s\S]*?\}\);/m;

const match = code.match(regex);
if (match) {
    const wrapped = `const filteredTransactions = React.useMemo(() => { return ` + match[0].replace('const filteredTransactions = ', '') + `\n  }, [transactions, filter, searchQuery, selectedCategory, startDate, endDate, selectedTags, sortBy, t.tous]);`;
    code = code.replace(regex, wrapped);

    fs.writeFileSync('src/components/History.tsx', code);
}
