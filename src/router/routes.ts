import HomePage from '@/components/HomePage/HomePage.vue'
import ProjectPage from '@/components/Projects/ProjectPage.vue'

export const routes = [
  { name: 'HomePage', path: '/', component: HomePage },
  { name: 'ProjectPage', path: '/project/:id', component: ProjectPage },
  // { name: 'OptimizationPage', path: '/optimization/:id' },
]
