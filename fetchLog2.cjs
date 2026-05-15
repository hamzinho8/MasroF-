const https = require('https');

function fetchUrl(url) {
  https.get(url, (res) => {
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
