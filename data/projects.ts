export interface Project {
  id: string;
  index: string;
  year: string;
  client: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  detailedCopy: string;
  ctaText: string;
  image: string;
  liveUrl?: string;
  codeUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'project-1',
    index: '01',
    year: '2026',
    client: 'MKP London LTD',
    title: 'MKP London LTD',
    subtitle: 'Multi-Branch Post Office Website',
    description: 'Bespoke full-stack site for a four-branch Post Office group, featuring live branch status, a 24/7 AI customer-service chatbot, an automated pricing pipeline and full local SEO across all four postcodes.',
    tags: [
      'Full Stack',
      'AI Chatbot',
      'Automated Pipelines',
      'Local SEO',
      'Schema.org',
      'Security'
    ],
    detailedCopy: 'Designed and built a custom multi-branch website for MKP London LTD across four Post Office branches (Forest Gate, Kentish Town, Leytonstone and Corringham). Each branch surfaces a live open/closed status and busy-times view. A 24/7 AI customer-service chatbot is trained on all branches and answers using real-time pricing.\n\nAn automated price pipeline pulls Royal Mail, DPD and Evri rates every 30 minutes with validation. Full local SEO across all four postcodes with structured-data markup, and security hardening across the full stack.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/mkp-london.png',
    liveUrl: 'https://mkplondon.co.uk/'
  },
  {
    id: 'project-2',
    index: '02',
    year: '2026',
    client: 'Infinitum Education',
    title: 'IFP & Programme Website',
    subtitle: 'Global College Programme Platform',
    description: 'A high-performance, bilingual marketing and admissions platform for the International Foundation Programme, featuring custom interactive curriculum explorers and dynamic application pipelines.',
    tags: [
      'Next.js',
      'Bilingual SEO',
      'Interactive UI',
      'Performance Optimization',
      'Admissions Portal'
    ],
    detailedCopy: 'Developed an elegant, high-converting digital platform for Infinitum Education\'s International Foundation Programme (IFP). The solution serves prospective global students with high-performance localized pages, bilingual SEO structures, and dynamic course explorers.\n\nBuilt with modern server-side rendering for sub-second load times worldwide, it integrates seamlessly with their enrollment CRM and includes an interactive tuition and requirements calculator.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/infinitum-education.png',
    liveUrl: 'https://www.infinitumeducation.com/'
  },
  {
    id: 'project-3',
    index: '03',
    year: '2026',
    client: 'Gup Shup',
    title: 'Chit Chat Chai',
    subtitle: 'Real-Time Chat & Community Hub',
    description: 'A vibrant social hub designed for tea lovers, pairing real-time instant messaging and community chat rooms with an interactive menu and events discovery system.',
    tags: [
      'WebSockets',
      'Real-time Chat',
      'TailwindCSS',
      'Node.js',
      'Express',
      'MongoDB'
    ],
    detailedCopy: 'Gup Shup (Chit Chat Chai) is a bespoke social platform that unites tea enthusiasts through custom discussion channels, real-time messaging, and shared event boards.\n\nPowered by socket-based communications, it delivers low-latency typing status, direct messages, and instant notifications, encased in an aesthetic, modern layout inspired by classic tea salons.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/gupshup-website.jpg',
    liveUrl: 'https://www.gupshupchitchatchai.com/'
  },
  {
    id: 'project-4',
    index: '04',
    year: '2025',
    client: 'HomeStay Exchange',
    title: 'HomeStay Exchange',
    subtitle: 'Peer-to-Peer Accommodation Platform',
    description: 'A secure, decentralized lodging platform for students and remote workers, enabling trust-verified house swapping, direct messaging, and automated booking calendars.',
    tags: [
      'Next.js',
      'PostgreSQL',
      'Auth0',
      'Calendar Sync',
      'P2P Messaging',
      'Maps Integration'
    ],
    detailedCopy: 'HomeStay Exchange is a student-focused peer-to-peer lodging network allowing verified users to list, discover, and swap accommodations temporarily. Features secure email verification, custom scheduling, and spatial maps.\n\nDesigned to reduce high rent overheads, the platform provides integrated direct chat, profile-matching recommendations, and dynamic map search clusters for local listings.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/homestay-exchange.jpg',
    liveUrl: 'https://team-11-homestay-exchange-app.vercel.app/',
    codeUrl: 'https://github.com/YameenMunir/Homestay-Exchange-App'
  },
  {
    id: 'project-5',
    index: '05',
    year: '2024',
    client: 'Cricket Match Analysis',
    title: 'Analysis & Prediction',
    subtitle: 'Machine Learning Match Predictor',
    description: 'Data analytics pipeline and ML model predicting cricket match outcomes based on historical player performance, weather, pitch conditions, and live in-game metrics.',
    tags: [
      'Python',
      'Pandas',
      'Scikit-Learn',
      'FastAPI',
      'Data Visualisation',
      'Predictive Modeling'
    ],
    detailedCopy: 'A predictive sports modeling project analyzing over a decade of match data to forecast professional cricket results. Built using custom feature engineering pipelines and random forest classifiers.\n\nOutputs real-time win-probabilities, visualizes run-rate changes over time, and assesses historical player match-ups to deliver robust match insights via a clean FastAPI dashboard.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/cricket-analysis.jpg',
    codeUrl: 'https://github.com/YameenMunir/Cricket-Match-Data-Analysis-and-Prediction-using-Machine-Learning'
  },
  {
    id: 'project-6',
    index: '06',
    year: '2025',
    client: 'Diabetes Prediction',
    title: 'Diabetes Prediction & Prevention',
    subtitle: 'ML Health Risk Assessment App',
    description: 'An interactive health portal leveraging machine learning to predict diabetes risk profiles from clinical biomarkers and deliver personalized preventive lifestyle recommendations.',
    tags: [
      'HealthTech',
      'Random Forest',
      'Streamlit',
      'Python',
      'Feature Engineering',
      'Clinical Data'
    ],
    detailedCopy: 'An ML-driven health assessment system using logistic regression and SVM classifiers trained on patient diagnostic datasets. Focuses on clinical accuracy and user-friendly risk presentation.\n\nFeatures interactive questionnaire forms, detailed explanation of key biomarkers (e.g. insulin, BMI), and generates customized nutritional and exercise guides to help users reduce long-term health risks.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/diabetes-app.jpg',
    codeUrl: 'https://github.com/YameenMunir/Diabetes-Prediction-and-Prevention-App-with-Streamlit'
  },
  {
    id: 'project-7',
    index: '07',
    year: '2024',
    client: 'Tokyo Olympics',
    title: 'Tokyo Olympics Data Analysis',
    subtitle: 'Big Data Visualisation & Insights',
    description: 'Comprehensive data engineering and visualization suite analyzing Tokyo Olympic athlete distributions, medal results, and historical country-wise performance trends.',
    tags: [
      'Apache Spark',
      'Python',
      'PowerBI',
      'SQL',
      'Data Engineering',
      'ETL Pipelines'
    ],
    detailedCopy: 'An end-to-end data pipeline processing official Olympics data to extract insights on coaching effects, gender representation, and socio-economic correlates of athletic success.\n\nUses automated ETL pipelines to clean raw CSV feeds, processes data using PySpark for scale, and visualizes complex multidimensional trends with responsive dashboards and maps.',
    ctaText: 'READ THE CASE STUDY ↓',
    image: '/olympics-analysis.jpg',
    codeUrl: 'https://github.com/YameenMunir/Tokyo-Olympics-Data-analysis'
  }
];


