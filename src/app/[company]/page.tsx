import HomePage from '../page'

type Props = {
  params: Promise<{ company: string }>
  searchParams: Promise<{ msg?: string }>
}

// Note: a slug matching a reserved top-level route name (e.g. "dashboard",
// "settings", "login") will resolve to that static route instead of here,
// since Next.js resolves static segments before dynamic ones.
export default async function CompanyLandingPage({ params, searchParams }: Props) {
  const { company } = await params
  const { msg } = await searchParams
  const displayName = decodeURIComponent(company)
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  const customText = msg ? decodeURIComponent(msg) : undefined

  return <HomePage companyName={displayName} customText={customText} slug={company} />
}
