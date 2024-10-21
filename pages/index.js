import Image from 'next/image'; // Importa el componente Image para manejar imágenes en Next.js
import RaceLeaderboard from "../components/RaceLeaderboard";

const Home = () => {
  return (
    <div>
      {/* Header con el logo centrado */}
      <header className="header">
        <Image
          src="/logo.png" // Ruta del logo en la carpeta public
          alt="Logo"
          width={448} // Cambia el tamaño según sea necesario
          height={157}
          className="logo"
        />
      </header>
      <main>
        <RaceLeaderboard />
      </main>
    </div>
  );
};

export default Home;