module.exports = function corsMiddleware(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://garussell1.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Signal that request was handled
  }
  return false;
};