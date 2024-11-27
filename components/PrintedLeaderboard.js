import { useEffect, useState, useRef } from "react";

const PrintedLeaderboard = () => {
  const [currentRaceNumber, setCurrentRaceNumber] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        const response = await fetch("/api/race");
        if (!response.ok) {
          throw new Error("Error fetching race data");
        }
        const data = await response.json();
        setCurrentRaceNumber(data.race.id);
      } catch (error) {
        console.error("Error fetching race data:", error);
      }
    };

    // Consulta inicial
    fetchRaceData();

    // Configura el intervalo para actualizar cada 10 segundos
    const intervalId = setInterval(fetchRaceData, 10000);

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
  }, []);

  useEffect(() => {
    // Agrega el evento load al iframe para realizar el scroll cuando su contenido termine de cargarse
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      // Desplaza el viewport hacia el final del contenido
      window.scrollTo({
        top: window.innerHeight, // Altura del viewport actual
        behavior: "smooth", // Desplazamiento suave
      });
    };

    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, [currentRaceNumber]);

  return (
    <div>
      {currentRaceNumber ? (
  <iframe
    ref={iframeRef}
    src={`https://frcostarica.clubspeedtiming.com/privatewww/allracersresults-frcostarica.aspx?HeatNo=${currentRaceNumber}`}
    style={{
      width: "100%",
      height: "100vh",
      border: "none",
    }}
  ></iframe>
) : (
  <div style={{ textAlign: "center", padding: "20px" }}>
    <p>Loading Race Results.</p>
  </div>
)}
    </div>
  );
};

export default PrintedLeaderboard;