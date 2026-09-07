import React from "react";
import { 
  X, 
  Download, 
  ExternalLink, 
  Mail, 
  Github, 
  Linkedin, 
  MapPin, 
  Briefcase, 
  Award, 
  Code2, 
  FileText,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AccessibleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibleViewModal: React.FC<AccessibleViewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[8000] bg-black/75 backdrop-blur-xl flex justify-center p-3 sm:p-6 md:p-10 overflow-y-auto"
        onClick={onClose}
      >
        <motion.article 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-[#18181b] border border-white/15 text-white/90 rounded-2xl w-full max-w-4xl p-6 sm:p-10 shadow-2xl my-auto select-text font-sans relative"
          onClick={(e) => e.stopPropagation()}
          aria-label="Hadi Gunawan Accessible Resume View"
        >
          {/* Top Floating Control Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Accessible / Classic Resume View</span>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="/Portofolio Hadi 2026.pdf" 
                download
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </a>

              <button 
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                aria-label="Return to Desktop View"
              >
                <Monitor size={14} />
                <span>Return to Desktop</span>
                <X size={14} className="ml-1" />
              </button>
            </div>
          </div>

          {/* Header Profile Section */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Hadi Gunawan
            </h1>
            <p className="text-lg sm:text-xl text-blue-400 font-medium mb-4">
              Senior Frontend &amp; Fullstack Engineer
            </p>
            <p className="text-sm text-white/70 leading-relaxed max-w-3xl mb-5">
              Software Engineer with 5+ years of hands-on experience architecting high-performance web applications, 
              scalable micro-frontend platforms, and immersive interactive user experiences with modern web technologies.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-white/40" /> Jakarta, Indonesia
              </span>
              <a 
                href="mailto:contact@hadigunawan.dev" 
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail size={14} className="text-white/40" /> contact@hadigunawan.dev
              </a>
              <a 
                href="https://github.com/cinnamorollofficials" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Github size={14} className="text-white/40" /> GitHub
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Linkedin size={14} className="text-white/40" /> LinkedIn
              </a>
            </div>
          </header>

          {/* Core Skills */}
          <section className="mb-10" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
              <Code2 size={14} className="text-blue-400" /> Core Technologies &amp; Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "React 19", "TypeScript", "Next.js", "Tailwind CSS v4", "Vite", 
                "Node.js", "GraphQL & REST", "Micro-frontends", "Framer Motion", 
                "Docker", "PostgreSQL", "CI/CD & DevOps", "Web Performance (Core Web Vitals)"
              ].map(skill => (
                <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/80">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Featured Projects */}
          <section className="mb-10" aria-labelledby="projects-heading">
            <h2 id="projects-heading" className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <FileText size={14} className="text-purple-400" /> Featured Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Maco — macOS Web Desktop",
                  desc: "High-fidelity interactive macOS Tahoe web reproduction built with React 19, Motion, and Tailwind CSS. Features custom window management, Finder file system, Terminal, Spotlight, and widgets.",
                  tech: ["React 19", "TypeScript", "Tailwind v4", "Docker"],
                  link: "https://github.com/cinnamorollofficials/maco"
                },
                {
                  title: "E-Commerce Microfrontend Platform",
                  desc: "Enterprise modular storefront architecture supporting autonomous multi-team deployment with near-zero latency catalog rendering.",
                  tech: ["Next.js", "Module Federation", "Node.js", "GraphQL"],
                  link: "https://github.com"
                },
                {
                  title: "AI Agent Orchestrator Pipeline",
                  desc: "Autonomous LLM workflow pipeline capable of decomposing multi-step development tasks, executing sandbox commands, and aggregating insights.",
                  tech: ["TypeScript", "LangChain", "Python", "Docker"],
                  link: "https://github.com"
                },
                {
                  title: "Tahoe UI Design System",
                  desc: "Glassmorphic component library crafted for modern web applications with accessibility standards and fluid micro-animations.",
                  tech: ["Tailwind CSS", "Framer Motion", "Storybook"],
                  link: "https://github.com"
                }
              ].map(project => (
                <div 
                  key={project.title} 
                  className="p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-white">{project.title}</h3>
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-white/40 hover:text-white transition-colors"
                          title="View Repository"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-white/65 mb-4 leading-relaxed">{project.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tech.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="mb-10" aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Briefcase size={14} className="text-amber-400" /> Professional Experience
            </h2>

            <div className="space-y-6">
              {[
                {
                  role: "Senior Frontend Engineer",
                  period: "2023 — Present",
                  points: [
                    "Architected scalable micro-frontend core serving over 2M monthly active users.",
                    "Improved Core Web Vitals (LCP reduced by 38%, FID improved to sub-50ms).",
                    "Mentored junior and mid-level engineers in modern React patterns and testing automation."
                  ]
                },
                {
                  role: "Fullstack Software Developer",
                  period: "2021 — 2023",
                  points: [
                    "Engineered RESTful & GraphQL backend services handling high-throughput transactions.",
                    "Implemented real-time synchronization pipelines with PostgreSQL and Redis.",
                    "Streamlined CI/CD deployment pipelines using Docker and GitHub Actions."
                  ]
                },
                {
                  role: "Frontend Specialist",
                  period: "2019 — 2021",
                  points: [
                    "Delivered responsive, pixel-perfect web interfaces from Figma specifications.",
                    "Introduced comprehensive unit and integration tests achieving 85%+ code coverage."
                  ]
                }
              ].map(exp => (
                <div key={exp.role} className="border-l-2 border-white/15 pl-4 ml-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                    <span className="text-xs text-white/40">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-white/65 space-y-1 mt-1.5">
                    {exp.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-8" aria-labelledby="certifications-heading">
            <h2 id="certifications-heading" className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Award size={14} className="text-emerald-400" /> Certifications &amp; Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                "AWS Certified Solutions Architect",
                "Meta Frontend Professional Certificate",
                "FullStack Specialist Certification"
              ].map(cert => (
                <div key={cert} className="p-3 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-2.5">
                  <Award size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-white/80 font-medium">{cert}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer inside modal */}
          <footer className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>© 2026 Hadi Gunawan. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <a 
                href="/Portofolio Hadi 2026.pdf" 
                download
                className="text-blue-400 hover:text-blue-300 font-medium underline"
              >
                Download PDF Resume
              </a>
              <span>•</span>
              <button 
                onClick={onClose}
                className="hover:text-white transition-colors"
              >
                Close View
              </button>
            </div>
          </footer>
        </motion.article>
      </div>
    </AnimatePresence>
  );
};

export default AccessibleViewModal;
