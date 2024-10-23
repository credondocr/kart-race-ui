import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

const RaceLeaderboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [fastestData, setFastestData] = useState(null); // Para guardar los récords del día
  const [previousFastest, setPreviousFastest] = useState(null); // Para comparar si hay un nuevo récord
  const [recordMessage, setRecordMessage] = useState(""); // Controla el mensaje de récord

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/race"); // URL del endpoint para leaderboard
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchFastestData = async () => {
      try {
        const response = await fetch("/api/records"); // URL del endpoint de los récords
        if (!response.ok) {
          throw new Error("Error fetching fastest data");
        }
        const result = await response.json();
        setFastestData(result.fastest);
        
        // Comprobar si el récord ha cambiado
        if (previousFastest && previousFastest.racer_id !== result.fastest[0].racer_id && previousFastest.fastest[0].lap_time !== result.fastest[0].lap_time) {
          const gap = result.fastest.length > 1 
            ? (result.fastest[0].lap_time - result.fastest[1].lap_time).toFixed(3)
            : null;
          setRecordMessage(`¡Nuevo récord del día! - ${result.fastest[0].nickname} con ${result.fastest[0].lap_time}s ${gap ? `(Gap: ${gap}s)` : ''}`);

          // Disparar el confeti
          triggerConfetti();

          // Actualizar el récord anterior
          setPreviousFastest(result.fastest[0]);

          setTimeout(() => setRecordMessage(""), 9000);
        } else if (!previousFastest) {
            if (result.fastest[0]) {
                setRecordMessage(`Record del día! - ${result.fastest[0]?.nickname} con ${result.fastest[0]?.lap_time}s `);
                triggerConfetti();
                setPreviousFastest(result.fastest[0]);
            }
        }
      } catch (error) {
        setError(error.message);
      }
    };

    // Llamar a fetchData y fetchFastestData inmediatamente y luego cada 30 segundos
    fetchData();
    fetchFastestData();
    const intervalId = setInterval(() => {
      fetchData();
      fetchFastestData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [previousFastest]);

  // Función para disparar confeti
  const triggerConfetti = () => {
    var end = Date.now() + 5 * 1000; // Duración del confeti (5 segundos)

    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 1000,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 1000,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { race, scoreboard } = data;

  const getPositionClass = (position) => {
    if (position === "1") return "position-1";
    if (position === "2") return "position-2";
    if (position === "3") return "position-3";
    return "position-rest";
  };

  // Generar la URL de la carrera actual
  const raceUrl = `https://leaderboard.fik.cr/race/${race.id}`;

  return (
    <div className="leaderboard-container">
      {/* Mostrar el mensaje de nuevo récord si existe */}
      {recordMessage && (
        <div className="record-message">{recordMessage}</div>
      )}

      <div className="header-container">
        <p className="qr-legend">Escanea para ver tu tiempo</p>
        <QRCodeSVG value={raceUrl} size={90} />
      </div>

      

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