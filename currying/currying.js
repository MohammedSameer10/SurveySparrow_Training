const createRequest = method => baseUrl => (endpoint, headers = {}, body = {}) => {
  return {
    method,
    url: baseUrl + endpoint,
    headers,
    body,
    send: () => {
      console.log(`Sending ${method.toUpperCase()} request to ${baseUrl + endpoint}`);
      console.log("Headers:", headers);
      console.log("Body:", body);
      return Promise.resolve({ status: 200, data: "OK" });
    }
  };
};

const getRequest = createRequest("GET")("https://api.example.com");
const postRequest = createRequest("POST")("https://api.example.com");

const jsonHeaders = { "Content-Type": "application/json" };

getRequest("/users", jsonHeaders).send().then(res => console.log("GET /users response:", res));
getRequest("/products", jsonHeaders).send().then(res => console.log("GET /products response:", res));

postRequest("/users", jsonHeaders, { name: "Sameer", role: "Developer" }).send().then(res => console.log("POST /users response:", res));
postRequest("/orders", jsonHeaders, { productId: 123, quantity: 2 }).send().then(res => console.log("POST /orders response:", res));
