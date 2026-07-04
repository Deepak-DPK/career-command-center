export interface SampleJob {
  title: string;
  company: string;
  description: string;
}

export const SAMPLE_JOBS: SampleJob[] = [
  {
    title: "Staff Full-Stack Engineer",
    company: "ScaleFlow Analytics (SaaS)",
    description: `About the Role:
We are seeking a Staff Full-Stack Engineer to lead development of our real-time streaming dashboard. You will design, build, and optimize microservices that handle over 150 million events daily.

Key Responsibilities:
- Architect robust frontend structures using React 19, Vite, and tailwind.
- Build reliable backend services in Node.js/Express, optimizing database read speeds and distributed caches (Redis).
- Set up Docker container architectures and Kubernetes orchestration for zero-downtime microservice deployments.
- Manage CI/CD automation pipelines using GitHub Actions and AWS EKS.

Requirements:
- 6+ years of professional software engineering experience.
- Deep expertise in systems design, distributed message queues (Kafka), and NoSQL databases (Cassandra/DynamoDB).
- Strong track record of leading technical squads and mentoring senior developers.
- Familiarity with enterprise-grade security and SOC2 compliance.`
  },
  {
    title: "Senior Product Manager (AI Platforms)",
    company: "Synthetix Workflows",
    description: `About the Role:
We are looking for a Senior Product Manager to spearhead our AI Agent integration initiatives. You will bridge engineering and design to deploy smart orchestration engines for consumer SaaS applications.

Key Responsibilities:
- Define product visions, roadmaps, and PRDs for the AI agentic team.
- Conduct continuous user research and draft cross-functional design sprints to align developers, marketers, and product teams.
- Run structured AB tests to maximize prompt response rates, token efficiency, and interface completion times.
- Coordinate with compliance to ensure GDPR/HIPAA standards.

Requirements:
- 4+ years in product management with a strong focus on machine learning, AI assistants, or vector index integrations.
- Ability to write basic python queries and deep understanding of LLM parameters (system instructions, temperature, prompt engineering).
- Excellent verbal positioning and stakeholders management under high pressure.`
  },
  {
    title: "Principal Cloud Architect",
    company: "AuraPay Financials",
    description: `About the Role:
Join us as a Principal Cloud Architect to secure and scale our high-throughput transactional gateway. You will oversee secure payments scaling and multi-region recovery strategies.

Key Responsibilities:
- Design high-availability multi-region setups in GCP / AWS.
- Enforce strict IAM policies, network firewalls, and data encryption standards (PCI-DSS compliance).
- Automate cluster scaling and load balancing to support 15,000 requests per second.
- Set up system monitoring, log alerts, and emergency recovery operations (Prometheus, Grafana, Datadog).

Requirements:
- 8+ years of core cloud architecture experience (AWS, Azure, or GCP).
- Professional cloud certifications (AWS Certified Solutions Architect Pro, Google Professional Cloud Architect).
- Comprehensive understanding of distributed consistency patterns, transactional databases, and server security audits.`
  }
];
