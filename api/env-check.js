export default async function handler(req, res) {
  const haveUri = !!process.env.MONGO_URI;
  const haveDb  = !!process.env.MONGO_DB;
  res.status(200).json({ haveUri, haveDb });
}
