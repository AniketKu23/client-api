const redis = require("redis");

// Create Redis client
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", (err) => {
  console.error("Redis client error:", err);
});

// ✅ Connect client
(async () => {
  try {
    await client.connect();
    console.log("✅ Redis client connected");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
})();

const setJWT = (key, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await client.set(key, value);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

const getJWT = (key) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await client.get(key);
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  setJWT,
  getJWT,
};
