export const ROUTES = [
  { path: '/', name: 'home', title: /revenue recovery/i },
  { path: '/platform', name: 'platform', title: /Platform/ },
  { path: '/modules', name: 'modules-index', title: /Modules/ },
  { path: '/modules/answer', name: 'answer', title: /Answer/ },
  { path: '/modules/respond', name: 'respond', title: /Respond/ },
  { path: '/modules/retain', name: 'retain', title: /Retain/ },
  { path: '/modules/reactivate', name: 'reactivate', title: /Reactivate/ },
  { path: '/industries/veterinary', name: 'veterinary', title: /Veterinary/ },
  { path: '/industries/dental', name: 'dental', title: /Dental/ },
  { path: '/about', name: 'about', title: /About/ },
  { path: '/insights', name: 'insights', title: /Insights/ },
  {
    path: '/insights/why-one-revenue-number-is-not-enough',
    name: 'insight',
    title: /recovered-revenue number/i,
  },
  { path: '/contact', name: 'contact', title: /assessment/i },
  { path: '/privacy', name: 'privacy', title: /Privacy/ },
  { path: '/terms', name: 'terms', title: /Terms/ },
  { path: '/dev/styleguide', name: 'styleguide', title: /Styleguide/ },
  { path: '/dev/motion-lab', name: 'motion-lab', title: /Motion lab/ },
] as const;

export const VIEWPORTS = [
  { name: '1440x1000', width: 1440, height: 1000 },
  { name: '1024x900', width: 1024, height: 900 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x800', width: 360, height: 800 },
] as const;
