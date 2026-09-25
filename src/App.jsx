import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import YouTubeSection from './components/YouTube/YouTubeSection';
import ReservedSection from './components/ReservedSection/ReservedSection';
import AboutUs from './components/AboutUs/AboutUs';
import FinalSection from './components/FinalSection/FinalSection';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <YouTubeSection />
        <ReservedSection />
        <AboutUs />
        <FinalSection />
      </main>
    </>
  );
}



