import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RaceDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [raceData, setRaceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRaceDetails = async () => {
      try {
        const response = await fetch(`/api/race/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching race data');
        }
        const data = await response.json();
        setRaceData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRaceDetails();
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!raceData) {
    return <p>Loading...</p>;
  }

  const { race, scoreboard } = raceData;

  // Ordenar los corredores por su posición final (finish_position)
  const sortedRacers = [...race.racers].sort((a, b) => a.finish_position - b.finish_position);

  // Obtener datos de las vueltas, ignorando la primera vuelta
  const lapData = sortedRacers.map((racer) =>
    racer.laps.slice(1).map((lap) => lap.lap_time >= 19 ? lap.lap_time : null)
  );

  // Número máximo de vueltas válidas (después de ignorar la primera vuelta)
  const maxLaps = Math.max(...lapData.map((laps) => laps.filter((lap) => lap !== null).length));

  // Etiquetas para las vueltas
  const lapLabels = [...Array(maxLaps)].map((_, i) => `Lap ${i + 1}`);

  // Datos para el gráfico
  const data = {
    labels: lapLabels,
    datasets: sortedRacers.map((racer, racerIndex) => ({
      label: `${racer.nickname} (Kart #${racer.kart_number})`,
      data: lapData[racerIndex],
      fill: false,
      borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      tension: 0.1,
      pointBackgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
      pointRadius: 3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Lap Time: ${tooltipItem.raw ? tooltipItem.raw.toFixed(3) : 'N/A'}s`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Laps',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Lap Time (seconds)',
        },
        min: 19, // No mostrar tiempos menores a 19 segundos
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 5,
      },
    },
  };

  // Función para formatear los tiempos a tres dígitos en las milésimas de segundo
  const formatLapTime = (time) => {
    return (typeof time === 'number' && !isNaN(time)) ? time.toFixed(3) : 'N/A';
  };

  return (
    <div className="race-table-container">
      <h1 className="race-table-header">{race.race_name}</h1>
      <p>Track: {race.track}</p>

      {/* Tabla de vueltas */}
      <table className="race-table">
        <thead>
          <tr>
            <th>#</th>
            {sortedRacers.map((racer) => (
              <th key={racer.id}>
                <div>{racer.nickname}</div>
                <div>(Kart #{racer.kart_number})</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxLaps)].map((_, lapIndex) => (
            <tr key={lapIndex}>
              <td>{lapIndex + 1}</td>
              {sortedRacers.map((racer, racerIndex) => (
                <td
                  key={racer.id}
                  className={lapData[racerIndex][lapIndex] === Math.min(...lapData[racerIndex].filter(lap => lap !== null)) ? 'highlight' : ''}
                >
                  {formatLapTime(lapData[racerIndex][lapIndex])}
                </td>
              ))}
            </tr>
          ))}
          {/* Fila de promedio, usando el average_lap_time del API */}
          <tr>
            <td><strong>➗</strong></td>
            {scoreboard.map((racer) => (
              <td key={racer.id}>
                <strong>{racer.average_lap_time}</strong>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <br />

      {/* Gráfico de progreso de las vueltas */}
      <div style={{ height: '400px', width: '100%', maxWidth: '100%', backgroundColor: 'white', marginBottom: '20px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RaceDetails;