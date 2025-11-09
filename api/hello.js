export default async function handler(req, res) {
  res.status(200).json({ ok: true, runtime: "node", time: new Date().toISOString() });
}
