const https = require('https');

https.get('https://api.github.com/repos/hamzinho8/MasroF-/git/trees/main?recursive=1', {
  headers: { 'User-Agent': 'my-script' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    try {
      const tree = JSON.parse(data).tree;
      const jar = tree.find(f => f.path.includes('gradle-wrapper.jar'));
      console.log('gradle-wrapper.jar found:', !!jar);
    } catch(e) {
      console.log('Error parsing tree', data.substring(0, 100));
    }
  });
}).on('error', console.error);
