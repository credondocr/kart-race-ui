import { useEffect, useState } from "react";

const RaceLeaderboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/race"); // URL del endpoint
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { scoreboard } = data;

  const getPositionClass = (position) => {
    if (position === "1") return "position-1";
    if (position === "2") return "position-2";
    if (position === "3") return "position-3";
    return "position-rest";
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-header">{data.race.race_name}</h1>
      <p>Track: {data.race.track}</p>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Nickname</th>
            <th>Kart</th>
            <th>Fastest Lap</th>
            <th>Average Lap</th>
          </tr>
        </thead>
        <tbody>
          {scoreboard.map((racer) => (
            <tr key={racer.racer_id}>
              <td className={getPositionClass(racer.position)}>{racer.position}</td>
              <td className={getPositionClass(racer.position)}>{racer.nickname}</td>
              <td className={getPositionClass(racer.position)}>{racer.kart_num}</td>
              <td className={getPositionClass(racer.position)}>{racer.fastest_lap_time}</td>
              <td className={getPositionClass(racer.position)}>{racer.average_lap_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RaceLeaderboard;