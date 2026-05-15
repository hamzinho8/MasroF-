import https from 'https';

https.get('https://github.com/hamzinho8/MasroF-/runs/25936249761/job/76242537992/logs', (res) => {
    let data = '';
    res.on('data', (d) => data += d);
    res.on('end', () => console.log(data));
});
