import { prisma } from '../lib/prisma.js'

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
    orderBy: { name: 'asc' },
  })

  return categories
}
