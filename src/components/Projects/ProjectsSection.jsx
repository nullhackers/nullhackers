import { useState } from 'react';
import ProjectCard from './ProjectCard';
import Pagination from './Pagination';
import projects from '../../data/projects';
import './Projects.css';

const ITEMS_PER_PAGE = 9;

export default function ProjectsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById('projects-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="projects-section section" id="projects-section">
      <div className="projects-section__glow" />
      <div className="section-inner">
        <div className="projects-section__header">
          <h2 className="projects-section__title">
            <span className="mono" style={{ color: 'var(--accent-terminal)', marginRight: '12px' }}>$</span>
            Our Projects
          </h2>
          <p className="projects-section__subtitle">Open-source tools built to explore, analyze, and secure.</p>
        </div>

        <div className="projects-grid">
          {currentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}
