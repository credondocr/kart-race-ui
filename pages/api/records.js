export default async function handler(req, res) {
    try {
      const response = await fetch("https://fklindora.clubspeedtiming.com/api/index.php/races/fastest.json?range=day&track=1&exclude_employees=1&key=cs-dev"); // Cambia por tu URL
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching race data" });
    }
  }