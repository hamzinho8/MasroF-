import fs from 'node:fs';

async function download() {
  const url = "https://zupimages.net/up/26/20/xpnu.png";
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 301 || res.status === 302) {
       console.log('Redirecting to', res.headers.get('location'));
    }
    console.error('Failed to fetch:', res.status, res.statusText);
    return;
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('assets/logo.png', Buffer.from(buffer));
  fs.writeFileSync('assets/icon.png', Buffer.from(buffer));
  fs.writeFileSync('public/logo.png', Buffer.from(buffer));
  console.log('Done');
}

download();
