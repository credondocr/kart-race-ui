export default async function handler(req, res) {
    try {
      const response = await fetch("https://fklindora.clubspeedtiming.com/api/index.php/races/previous.json?track=1&key=cs-dev");
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching race data" });
    }
  }