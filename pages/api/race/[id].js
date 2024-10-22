export default async function handler(req, res) {
    const { id } = req.query;
  
    try {
      // Realiza la petición al API externo utilizando el ID de la carrera
      const response = await fetch(`https://fklindora.clubspeedtiming.com/api/index.php/races/${id}.json?key=cs-dev`); // Reemplaza con la URL de tu API externa
      if (!response.ok) {
        throw new Error('Error fetching race data');
      }
      const raceData = await response.json();
  
      // Retorna los datos obtenidos al frontend
      res.status(200).json(raceData);
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: 'Error fetching race data', error: error.message });
    }
  }