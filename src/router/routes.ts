import HomePage from '@/components/HomePage/HomePage.vue'
import ProjectPage from '@/components/Projects/ProjectPage.vue'
import ProjectResultPage from '@/components/Projects/ProjectResultPage.vue'

export const routes = [
  { name: 'HomePage', path: '/', component: HomePage },
  { name: 'ProjectPage', path: '/project/:id', component: ProjectPage },
  { name: 'ProjectResultPage', path: '/project-result/:id', component: ProjectResultPage },
]
