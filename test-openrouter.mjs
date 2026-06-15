import fetch from 'node-fetch';

async function test() {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer fake"
        },
        body: JSON.stringify({
            model: "google/gemini-1.5-flash",
            messages: [{ role: "user", content: [{ type: "text", text: "Respond with {}" }] }]
        })
    });
    console.log(res.status, await res.text());
}
test();
