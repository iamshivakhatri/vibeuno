import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getUsers } from "@/actions/user"
import { getCities } from "@/actions/place"

// async function getCities() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cities`)
//   return res.json()
// }

// async function getUsers() {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users`)
//   return res.json()
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const query = new QueryClient();

  // Prefetch the data
  await query.prefetchQuery({
    queryKey: ["cities"],
    queryFn: getCities,
  })

  await query.prefetchQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  return (

      <HydrationBoundary state={dehydrate(query)}>
            {children}
      </HydrationBoundary>

  )
}

