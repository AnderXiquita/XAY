import HomeView from '@/components/home/HomeView'
import { getProducts, type Product } from '@/lib/api'

async function getFeatured(): Promise<Product[]> {
  try {
    return (await getProducts({ is_featured: 'true', limit: 4 })).data
  } catch {
    return []
  }
}

export default async function HomePage() {
  return <HomeView featured={await getFeatured()} />
}
