import Link from "next/link";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const projects = [
  {
    number: "01",
    title: "QR Code Crafter",
    href: "/qr-code-crafter/",
    description: "Generate professional QR codes instantly for any text or URL. Free QR code generator with multiple formats and sizes.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  },
  {
    number: "02",
    title: "Invoice Crafter",
    href: "/invoice-crafter/",
    description: "Professional invoice generator with PDF export, multiple currencies, live preview, and customizable templates for freelancers and businesses.",
    tags: ["JavaScript", "jsPDF", "HTML", "CSS"],
  },
  {
    number: "03",
    title: "Google Homepage Replica",
    href: "/google-replica-TOP-master/",
    description: "A pixel-perfect recreation of the Google homepage, showcasing HTML and CSS fundamentals.",
    tags: ["HTML", "CSS", "Responsive"],
  },
  {
    number: "04",
    title: "Rock Paper Scissors",
    href: "/rock-paper-scissor-game/",
    description: "Classic rock-paper-scissors game with a clean interface. Play against the computer.",
    tags: ["JavaScript", "HTML", "CSS"],
  },
  {
    number: "05",
    title: "Video Library",
    href: "/video-library/",
    description: "Interactive video player and representation project demonstrating media handling capabilities.",
    tags: ["JavaScript", "HTML5", "CSS"],
  },
];

function ProjectCard({ number, title, href, description, tags }: typeof projects[0]) {
  return (
    <Link
      href={href}
      className="block py-8 border-b border-zinc-800 transition-all duration-200 hover:pl-4 hover:bg-white/[0.02] group"
    >
      <div className="flex items-center gap-4 mb-2 max-md:flex-col max-md:items-start max-md:gap-1">
        <span className="text-sm text-zinc-600 font-normal min-w-10 max-md:min-w-0">{number}</span>
        <h2 className="text-2xl font-normal text-zinc-400 transition-colors duration-200 group-hover:text-white">
          {title}
        </h2>
      </div>
      <p className="text-zinc-500 text-[0.95rem] ml-14 mb-3 max-md:ml-0">{description}</p>
      <div className="flex flex-wrap gap-3 ml-14 max-md:ml-0">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-zinc-500 uppercase tracking-wider font-normal before:content-['·'] before:mr-2 before:text-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundRippleEffect />
      <div className="relative z-10 max-w-[900px] mx-auto px-8 py-16 max-md:px-4 max-md:py-8">
        <header className="mb-16 border-b border-zinc-700 pb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2 max-md:text-3xl">VampishWolf</h1>
          <p className="text-base text-zinc-500 font-light">Web Developer / Creative Technologist</p>
        </header>

        <div className="flex flex-col">
          {projects.map((project) => (
            <ProjectCard key={project.number} {...project} />
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-zinc-800 text-center text-zinc-600 text-sm">
          <p className="mb-2">
            <a
              href="mailto:ashish.mittal731@gmail.com"
              className="text-zinc-400 hover:text-white transition-colors duration-200"
            >
              ashish.mittal731@gmail.com
            </a>
          </p>
          <p>&copy; {new Date().getFullYear()} VampishWolf</p>
        </footer>
      </div>
    </div>
  );
}
