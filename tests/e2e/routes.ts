export const ROUTES = [
  { path: '/', name: 'home', title: /video, imagery and ad creative/i },
  { path: '/AI', name: 'studio', title: /video, imagery and ad creative/i },
  { path: '/privacy', name: 'privacy', title: /Privacy/ },
  { path: '/terms', name: 'terms', title: /Terms/ },
] as const;

export const VIEWPORTS = [
  { name: '1440x1000', width: 1440, height: 1000 },
  { name: '1024x900', width: 1024, height: 900 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x800', width: 360, height: 800 },
] as const;
