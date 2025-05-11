// Mock job listings data
let jobs = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions Inc.',
      description: 'Work on React-based web apps and help improve UX/UI.'
    },
    {
      id: 2,
      title: 'Software Engineering Intern',
      company: 'Innovatech',
      description: 'Collaborate on backend services using Node.js and Express.'
    }
  ];
  
  // Simulate delay
  const simulateDelay = () =>
    new Promise((resolve) => setTimeout(resolve, 300));
  
  export const fetchJobs = async () => {
    await simulateDelay();
    return [...jobs]; // Return a copy
  };
  
  export const deleteJob = async (id) => {
    await simulateDelay();
    jobs = jobs.filter((job) => job.id !== id);
  };
  
  export const saveJob = async (id) => {
    await simulateDelay();
    jobs = jobs.filter((job) => job.id !== id);
  };
  