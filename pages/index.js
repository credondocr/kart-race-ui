import PrintedLeaderboard from "../components/PrintedLeaderboard";
import RaceLeaderboard from "../components/RaceLeaderboard";


const Home = () => {
  return (
    <div>
      {/* Header con el logo centrado */}

      <main>
        <PrintedLeaderboard/>
        {/* <RaceLeaderboard /> */}
      </main>
    </div>
  );
};

export default Home;