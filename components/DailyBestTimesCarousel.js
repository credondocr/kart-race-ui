import React, { useState, useEffect } from "react";

const DailyBestTimesCarousel = () => {
  const [fastestTimes, setFastestTimes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFastestTimes = async () => {
      try {
        const response = await fetch("/api/records"); // Endpoint de tiempos
        if (!response.ok) {
          throw new Error("Error fetching fastest times");
        }
        const data = await response.json();
        setFastestTimes(data.fastest.slice(0, 5)); 
      } catch (error) {
        setError(error.message);
      }
    };

    fetchFastestTimes();

    const intervalId = setInterval(fetchFastestTimes, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div  className=" custom-text header-container ext-5xl fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center h-10 flex items-center overflow-hidden">
      <div className="flex items-center  animate-marquee whitespace-nowrap">
        {fastestTimes.map((time, index) => (
          <div key={index} className="inline-block px-6 text-color">
            {`${index + 1} - ${time.nickname}`} <span className="time-color">{time.lap_time.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyBestTimesCarousel;