const https = require('https');
https.get('https://api.github.com/repos/hamzinho8/MasroF-/actions/jobs/76253259835', {
  headers: { 'User-Agent': 'my-script' }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data));
}).on('error', console.error);
