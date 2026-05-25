export const LEGAL_PAGES = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/disclaimer', label: 'Disclaimer' },
  { to: '/cookie-policy', label: 'Cookie Policy' },
] as const

export const LEGAL_CONTACT = {
  privacy: 'supportgridaan@gmail.com',
  legal: 'legal@gridaan.com',
  general: 'gridaanmedia@gmail.com',
} as const

export function getLegalYear() {
  return new Date().getFullYear()
}
