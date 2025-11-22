import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: 'vision',
    title: 'Apple Vision Pro',
    category: 'Data Analysis',
    year: '2024',
    description: 'Clustering analysis of social engagement.',
    image: '/assets/vision-pro-static.jpeg',
    link: 'https://github.com/Andyreww/Apple-Vision-Pro-Engagement'
  },
  {
    id: 'music',
    title: 'Music Classifier',
    category: 'Machine Learning',
    year: '2023',
    description: 'Audio waveform classification with CNNs.',
    image: '/assets/MCR.png',
    link: 'https://github.com/Andyreww/Music-Classifier-Recommender'
  },
  {
    id: 'forsaken',
    title: 'FORSAKEN',
    category: 'Game Dev',
    year: '2023',
    description: 'Souls-like dungeon crawler in Unity.',
    image: '/assets/Forsaken.png',
    link: 'games/Forsaken/index.html'
  },
  {
    id: 'network',
    title: 'NetworkAI',
    category: 'Web App',
    year: '2024',
    description: 'Connecting job seekers via AI.',
    image: '/assets/NetworkAI.png',
    link: '#'
  },
  {
    id: 'manhwa',
    title: 'Manhwa Scanlator',
    category: 'Computer Vision',
    year: '2024',
    description: 'Auto-translation pipeline for comics.',
    image: '/assets/manhwa-AI.png',
    link: 'https://github.com/Andyreww/Manhwa-AI'
  }
];

const ProjectItem = ({ project, setHoveredProject, index }) => {
  return (
    <motion.a 
      href={project.link}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHoveredProject(project)}
      onMouseLeave={() => setHoveredProject(null)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex items-center justify-between border-t border-black py-12 md:py-16 cursor-pointer overflow-hidden"
    >
      {/* Background Slide Effect */}
      <div className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out -z-10" />

      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12 z-10 transition-colors duration-300 group-hover:text-white px-4 md:px-12 w-full">
        <span className="text-sm font-mono opacity-60">0{index + 1}</span>
        <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">{project.title}</h3>
        <span className="md:ml-auto text-sm md:text-base font-medium uppercase tracking-widest opacity-80">{project.category}</span>
      </div>
      
      <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 mr-4 md:mr-12 transition-transform duration-300 group-hover:text-white group-hover:rotate-45" />
    </motion.a>
  );
};

export default function ProjectsList() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    /* Fixed: Changed bg-background to bg-[#f4f4f0] */
    <section id="projects" className="relative bg-[#f4f4f0] text-black min-h-screen flex flex-col pt-24">
      
      <div className="px-4 md:px-12 mb-12 md:mb-24">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Selected Works</h2>
        <div className="text-xl md:text-2xl max-w-2xl font-medium">
          A collection of experiments, applications, and digital artifacts.
        </div>
      </div>

      <div className="border-b border-black">
        {projects.map((project, index) => (
          <ProjectItem 
            key={project.id} 
            project={project} 
            index={index} 
            setHoveredProject={setHoveredProject} 
          />
        ))}
      </div>

      {/* Floating Image Preview */}
      <AnimatePresence>
        {hoveredProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", rotate: Math.random() * 10 - 5 }}
            exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            transition={{ duration: 0.2 }}
            style={{ left: "50%", top: "50%" }}
            className="pointer-events-none fixed z-50 w-[300px] md:w-[500px] aspect-video rounded-lg overflow-hidden shadow-2xl border-4 border-black bg-white hidden md:block"
          >
            <img 
              src={hoveredProject.image} 
              alt={hoveredProject.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 bg-black text-white px-3 py-1 text-xs font-mono uppercase">
              {hoveredProject.year} — {hoveredProject.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}