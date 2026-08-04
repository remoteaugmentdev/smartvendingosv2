// Demo link slugs: shared by the admin generator (client) and the lead API (server)
// so a company typed in either place lands on the same URL.
export function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
