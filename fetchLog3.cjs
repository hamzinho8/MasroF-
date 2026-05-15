const https = require('https');
const url = require('url');

function fetchUrl(targetUrl) {
  const options = url.parse(targetUrl);
  options.headers = { 'User-Agent': 'my-script' };
  
  https.get(options, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      fetchUrl(res.headers.location);
    } else {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => console.log(data));
    }
  }).on('error', console.error);
}

fetchUrl('https://api.github.com/repos/hamzinho8/MasroF-/actions/jobs/76253259835/logs');
