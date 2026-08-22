import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import InteractiveSection from './components/InteractiveSection/InteractiveSection';
import ProjectsSection from './components/Projects/ProjectsSection';
import ReservedSection from './components/ReservedSection/ReservedSection';
import FinalSection from './components/FinalSection/FinalSection';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <InteractiveSection />
        <ProjectsSection />
        <ReservedSection />
        <FinalSection />
      </main>
    </>
  );
}
