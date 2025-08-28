const { Client } = require('@opensearch-project/opensearch');

const node = process.env.OPENSEARCH_NODE || 'https://localhost:9200';
const username = process.env.OPENSEARCH_USERNAME || 'admin';
const password = process.env.OPENSEARCH_PASSWORD || 'Sameer@1011';

const client = new Client({ node, auth: { username, password }, ssl: { rejectUnauthorized: false } });

module.exports = client;


