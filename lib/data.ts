export const siteData = {
  name: "Omer Zaadi",
  title: "Software Developer",
  tagline: "Available for opportunities",
  description:
    "Software developer focused on the intersection of full-stack architecture and advanced LLM agents. Utilizing a versatile stack including Python, SQL, C, and React to transform complex operational logic into scalable, secure, and production-ready software solutions.",
  contact: {
    email: "omerzadi2014@gmail.com",
    phone: "054-8815358",
    linkedin: "https://www.linkedin.com/in/omer-zaadi-961028338/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BDvi6EuiETV%2BRs7%2F5EBHgvA%3D%3D",
    github: "https://github.com/omer-zaadi",
  },
  about: {
    paragraphs: [
      "I'm <strong>Omer Zaadi</strong> — a software developer and performance researcher based in Israel. I hold a B.Sc. in Computer Science from HIT, where I developed a strong foundation in algorithms, system design, and data analysis.",
      "My technical focus is at the crossroads of <em>full-stack engineering</em> and <em>LLM-powered systems</em>. I believe the most interesting problems today are where traditional software architecture meets the reasoning capabilities of large language models — and I build exactly in that space.",
      "Before moving into software, I spent <strong>eight years as a Crew Chief in the Israeli Air Force</strong>, leading technical teams in mission-critical environments. That experience shaped how I think: precise, structured, and calm under pressure.",
      "I build things that are <strong>secure, scalable, and production-ready</strong> — not just functional. Whether it's a full-stack application with a real-time AI engine or an autonomous agent analyzing cloud infrastructure, I care deeply about the details that make software trustworthy.",
    ],
    stats: [
      { value: "8+", label: "Years of leadership in the Israeli Air Force" },
      { value: "B.Sc.", label: "Computer Science — Holon Institute of Technology, 2025" },
      { value: "2", label: "End-to-end projects combining AI, full-stack, and security" },
    ],
    quote:
      "Complex systems don't fail because of dramatic errors — they fail because of overlooked dependencies.",
  },
  skills: [
    {
      category: "Programming Languages",
      items: ["Python", "JavaScript", "C#", "SQL"],
    },
    {
      category: "Frameworks & Libraries",
      items: ["React", "FastAPI"],
    },
    {
      category: "Databases",
      items: ["MySQL", "MongoDB"],
    },
    {
      category: "Infrastructure & Tools",
      items: ["Docker", "Git", "GitHub", "Linux", "VS Code"],
    },
    {
      category: "Research & Analysis",
      items: ["Performance Evaluation", "System Simulation", "LLM Agents", "Optimization"],
    },
  ],
  projects: [
    {
      number: "01",
      title: "Crew Management System",
      description:
        "A secure full-stack application designed to manage crew missions and worker assignments in real time. Built with FastAPI and React, featuring JWT authentication and Bcrypt hashing for robust data protection. An optimized MySQL database handles real-time dependency tracking, while the integrated Anthropic API powers an intelligent AI engine for automated resource allocation.",
      tags: ["FastAPI", "React", "MySQL", "JWT Auth", "Anthropic API", "Docker"],
      github: "https://github.com/omer-zaadi/Crew-Management-System",
      image: "/crew-management.png",
    },
    {
      number: "02",
      title: "Cloud Configuration Performance",
      description:
        "An independent research project at the intersection of LLM reasoning and cloud infrastructure analysis. Designed and developed an autonomous agent that analyzes, audits, and evaluates complex cloud system configurations — simulating dependency paths, identifying structural flaws, processing risks, and security compliance gaps end-to-end without human intervention.",
      tags: ["Python", "LLM Agent", "Cloud Security", "Data Analysis", "Optimization"],
      github: "https://github.com/YOUR_GITHUB/cloud-config",
      image: "/cloud-config.png",
    },
  ],
  experience: [
    {
      title: "Airforce Crew Chief",
      org: "Israeli Air Force",
      period: "Feb 2017 – Dec 2025",
      bullets: [
        "Led technical teams in high-pressure, mission-critical environments, managing complex schedules to ensure 100% operational readiness.",
        "Streamlined complex workflows and technical documentation practices, significantly improving team efficiency, delivery speed, and process quality.",
        "Accountable for rapid, analytical decision-making and real-time troubleshooting in time-sensitive, high-stakes operational scenarios.",
      ],
    },
  ],
  education: [
    {
      degree: "Computer Science B.Sc.",
      school: "Holon Institute of Technology (HIT)",
      period: "2022 – 2025",
      details: "Data Structures · Algorithms · Database Systems · Software Engineering · OOP",
    },
    {
      degree: "Mechanical Engineering Technician Diploma",
      school: "ORT Rehovot",
      period: "2015 – 2016",
      details: null,
    },
  ],
};
