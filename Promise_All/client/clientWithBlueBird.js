import fetch from "node-fetch";
import Promise from "bluebird";

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
  let concurrency = 10; 
  let delayMs = 50;    
  const maxConcurrency = 20;
  const minConcurrency = 1;
  const ids = Array.from({ length: 100 }, (_, i) => i + 1);

  while (ids.length > 0) {
    const batch = ids.splice(0, Math.min(concurrency, ids.length));
    const startTime = Date.now();
    const results = await Promise.map(batch, id => fetchContact(id), { concurrency });
    const batchDuration = Date.now() - startTime;
    const failures = results.filter(r => r.error);
    const successCount = results.length - failures.length;
    if (failures.length > results.length / 2) {
      concurrency = Math.max(minConcurrency, Math.floor(concurrency / 2));
      ids.unshift(...failures.map(f => f.id));
      delayMs = Math.min(1100, delayMs + 100);
    } else if (failures.length === 0 && ids.length > 0) {
      concurrency = Math.min(maxConcurrency, concurrency + 1);
      if (batchDuration < delayMs && delayMs > 20) {
        delayMs = Math.max(20, delayMs - 20);
      }
    } else {
      delayMs = Math.min(1000, delayMs + 20);
      ids.unshift(...failures.map(f => f.id));
    }

    console.log(`Concurrency: ${concurrency}, Delay: ${delayMs}ms, Success: ${successCount}, Failed: ${failures.length}, Batch time: ${batchDuration}ms`);

    if (ids.length > 0) {
      await Promise.delay(delayMs);
    }
  }
  return "All requests completed successfully!";
}

send100Requests().then(console.log);
