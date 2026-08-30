import type { ProjectData } from './types'

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'PRJ-001',
    title: 'AI-Powered Learning Analytics Dashboard',
    description: 'Plataforma de análisis de datos educativos con inteligencia artificial para predecir rendimiento estudiantil y optimizar rutas de aprendizaje personalizadas.',
    author: 'Dra. María González',
    category: 'Inteligencia Artificial',
    technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
    status: 'active',
    imageUrl: undefined,
    createdAt: '15/01/2025',
    updatedAt: '12/03/2025',
    views: 1247,
    likes: 89,
    comments: 23,
    technicalSpec: {
      methodology: 'Machine Learning Predictivo',
      tools: ['Scikit-learn', 'Pandas', 'D3.js'],
      duration: '6 meses',
      teamSize: 5
    },
    gallery: [
      { url: 'https://picsum.photos/seed/ai1/400/250', caption: 'Dashboard principal' },
      { url: 'https://picsum.photos/seed/ai2/400/250', caption: 'Modelo predictivo' },
      { url: 'https://picsum.photos/seed/ai3/400/250', caption: 'Visualización de datos' }
    ],
    isFavorite: false,
    contactEmail: 'maria.gonzalez@uapa.edu.do'
  },
  {
    id: 'PRJ-002',
    title: 'Blockchain Supply Chain Tracker',
    description: 'Sistema de trazabilidad descentralizado para cadenas de suministro con smart contracts y verificación en tiempo real.',
    author: 'Ing. Carlos Ramírez',
    category: 'Blockchain',
    technologies: ['Solidity', 'Ethereum', 'Vue.js', 'Node.js'],
    status: 'pending',
    imageUrl: undefined,
    createdAt: '01/02/2025',
    updatedAt: '10/03/2025',
    views: 892,
    likes: 67,
    comments: 15,
    technicalSpec: {
      methodology: 'Smart Contracts Auditados',
      tools: ['Hardhat', 'IPFS', 'Chainlink'],
      duration: '8 meses',
      teamSize: 7
    },
    isFavorite: true,
    contactEmail: 'carlos.ramirez@uapa.edu.do'
  },
  {
    id: 'PRJ-003',
    title: 'Real-time Collaboration Platform',
    description: 'Entorno de colaboración en tiempo real con edición simultánea, video conferencias y gestión documental integrada.',
    author: 'Lic. Ana Martínez',
    category: 'Cloud Computing',
    technologies: ['WebSocket', 'React', 'Firebase', 'WebRTC'],
    status: 'active',
    imageUrl: undefined,
    createdAt: '20/11/2024',
    updatedAt: '14/03/2025',
    views: 2103,
    likes: 156,
    comments: 47,
    technicalSpec: {
      methodology: 'Microservicios Escalables',
      tools: ['Redis', 'Docker', 'Kubernetes'],
      duration: '4 meses',
      teamSize: 4
    },
    gallery: [
      { url: 'https://picsum.photos/seed/collab1/400/250', caption: 'Interfaz de colaboración' },
      { url: 'https://picsum.photos/seed/collab2/400/250', caption: 'Panel de chat' }
    ],
    isFavorite: false,
    contactEmail: 'ana.martinez@uapa.edu.do'
  },
  {
    id: 'PRJ-004',
    title: 'IoT Home Automation Suite',
    description: 'Suite de automatización del hogar con control de dispositivos IoT, dashboards personalizados y API de integración abierta.',
    author: 'Ing. Pedro Sánchez',
    category: 'Internet de las Cosas',
    technologies: ['Arduino', 'MQTT', 'Flutter', 'Python'],
    status: 'completed',
    imageUrl: undefined,
    createdAt: '05/09/2024',
    updatedAt: '28/02/2025',
    views: 3456,
    likes: 234,
    comments: 78,
    technicalSpec: {
      methodology: 'Sistemas Embarcados',
      tools: ['Raspberry Pi', 'Home Assistant', 'Grafana'],
      duration: '10 meses',
      teamSize: 8
    },
    isFavorite: true,
    contactEmail: 'pedro.sanchez@uapa.edu.do'
  },
  {
    id: 'PRJ-005',
    title: 'AR Virtual Campus Experience',
    description: 'Experiencia de realidad aumentada para recorridos virtuales del campus universitario con overlays informativos interactivos.',
    author: 'Dra. Laura Fernández',
    category: 'Realidad Aumentada',
    technologies: ['ARCore', 'Unity', 'Three.js', 'C#'],
    status: 'active',
    imageUrl: undefined,
    createdAt: '12/12/2024',
    updatedAt: '13/03/2025',
    views: 567,
    likes: 45,
    comments: 12,
    technicalSpec: {
      methodology: 'Mobile AR Development',
      tools: ['Vuforia', 'Blender', 'Mapbox'],
      duration: '5 meses',
      teamSize: 6
    },
    gallery: [
      { url: 'https://picsum.photos/seed/ar1/400/250', caption: 'Vista del campus' },
      { url: 'https://picsum.photos/seed/ar2/400/250', caption: 'Overlay informativo' },
      { url: 'https://picsum.photos/seed/ar3/400/250', caption: 'Modo guía' },
      { url: 'https://picsum.photos/seed/ar4/400/250', caption: 'Panel de info' }
    ],
    isFavorite: false,
    contactEmail: 'laura.fernandez@uapa.edu.do'
  },
  {
    id: 'PRJ-006',
    title: 'Cybersecurity Threat Intelligence',
    description: 'Plataforma de inteligencia contra amenazas cibernéticas con análisis de malware, detección de anomalías y reports automatizados.',
    author: 'Ing. Jorge Herrera',
    category: 'Ciberseguridad',
    technologies: ['Go', 'Elasticsearch', 'React', 'YARA'],
    status: 'pending',
    imageUrl: undefined,
    createdAt: '28/01/2025',
    updatedAt: '11/03/2025',
    views: 734,
    likes: 38,
    comments: 9,
    technicalSpec: {
      methodology: 'Threat Hunting Proactivo',
      tools: ['Suricata', 'Splunk', 'MISP'],
      duration: '7 meses',
      teamSize: 5
    },
    isFavorite: false,
    contactEmail: 'jorge.herrera@uapa.edu.do'
  }
]

export const PROJECT_CATEGORIES = [
  'Todas',
  'Inteligencia Artificial',
  'Blockchain',
  'Cloud Computing',
  'Internet de las Cosas',
  'Realidad Aumentada',
  'Ciberseguridad'
]
