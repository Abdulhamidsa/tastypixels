import { connectDB, fetchData } from "../../database/dataFetcher";

export default async function handler(req, res) {
  const userData = (await fetchData()) || [];
  res.status(200).json(userData);
}
