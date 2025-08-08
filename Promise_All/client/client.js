import fetch from "node-fetch";

const baseUrl = "http://localhost:3000/api/contact/";

async function fetchContact(id) {
  try {
    const res = await fetch(baseUrl + id);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return { id, data };
  } catch (error) {
    return { id, error: error.message };
  }
}

async function send100Requests() {
  const promises = [];
  for (let i = 1; i <= 100; i++) {
    promises.push(fetchContact(i));
  }
  const results = await Promise.all(promises);
  return results;
}

send100Requests().then(results => {
  const successCount = results.filter(r => !r.error).length;
  const failCount = results.filter(r => r.error).length;

  console.log(`Success: ${successCount}`);
  console.log(`Failed (rate limited): ${failCount}`);
  console.log("Sample errors:", results.filter(r => r.error).slice(0, 5));
});
