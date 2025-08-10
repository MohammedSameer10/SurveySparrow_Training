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

async function batch() {
  const results = [];
  for (let i = 1; i <= 100; i += 5) {
    results.push(...await Promise.all([1,2,3,4,5].map(j => i+j-1 <= 100 ? fetchContact(i+j-1) : null).filter(Boolean)));
    if (i <= 95) await new Promise(r => setTimeout(r, 1000));
  }
  return results;
}

batch().then(r => console.log('Batch:', r.filter(x => !x.error).length));
