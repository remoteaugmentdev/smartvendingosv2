import { redirect } from 'next/navigation'

// Temporary: open the login page on start. The landing page is preserved at /landing.
export default function Home() {
  redirect('/login')
}
