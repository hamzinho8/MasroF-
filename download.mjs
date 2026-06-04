import fs from 'fs';
import path from 'path';

async function download() {
    const url = "https://i2.wp.com/i.postimg.cc/8k2Y4Hfr/icon.png";
    console.log("Downloading", url);
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
        console.error("Failed", res.status);
        process.exit(1);
    }
    const buf = await res.arrayBuffer();
    const buffer = Buffer.from(buf);
    
    fs.writeFileSync(path.join(process.cwd(), 'assets', 'icon.png'), buffer);
    fs.writeFileSync(path.join(process.cwd(), 'assets', 'logo.png'), buffer);
    fs.writeFileSync(path.join(process.cwd(), 'assets', 'splash.png'), buffer);
    fs.writeFileSync(path.join(process.cwd(), 'public', 'icon.png'), buffer);
    fs.writeFileSync(path.join(process.cwd(), 'public', 'logo.png'), buffer);
    console.log("Done sizes:", buffer.length);
}
download();
