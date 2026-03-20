import { prisma } from '../lib/prisma.js'

export async function getDepartments() {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: { name: 'asc' },
  })

  return departments
}

export async function getDepartmentWithMunicipalities(slug: string) {
  const department = await prisma.department.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      municipalities: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  })

  return department
}
