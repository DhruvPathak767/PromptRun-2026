export interface RouteMeta {
  title: string
  subtitle: string
  documentTitle: string
}

export const ROUTE_METADATA: Record<string, RouteMeta> = {
  '/': {
    title: 'RupeeFlow Command Center',
    subtitle: 'Your ₹10,000 30-day financial command center in motion.',
    documentTitle: 'Command Center | RupeeFlow',
  },
  '/transactions': {
    title: 'Transaction Ledger',
    subtitle: 'Search, filter, and review all 30-day expenses and cash inflows.',
    documentTitle: 'Transaction Ledger | RupeeFlow',
  },
  '/budget': {
    title: '30-Day Budget Planner',
    subtitle: 'Daily burn timeline, fixed vs variable obligations, and daily allowance pacing.',
    documentTitle: 'Budget Planner | RupeeFlow',
  },
  '/goals': {
    title: 'Savings Goals',
    subtitle: 'Build financial cushions and milestones without shrinking real savings.',
    documentTitle: 'Savings Goals | RupeeFlow',
  },
  '/subscriptions': {
    title: 'Subscriptions & Commitments',
    subtitle: 'Manage monthly recurring services and upcoming cycle obligations.',
    documentTitle: 'Subscriptions & Commitments | RupeeFlow',
  },
  '/simulator': {
    title: 'What-If Decision Lab',
    subtitle: 'Simulate financial decisions safely before committing them to your real budget.',
    documentTitle: 'What-If Lab | RupeeFlow',
  },
  '/insights': {
    title: 'Financial Health & Insights',
    subtitle: 'Explainable health scoring, spending risk alerts, and actionable recommendations.',
    documentTitle: 'Health & Insights | RupeeFlow',
  },
  '/settings': {
    title: 'Settings & Demo Controls',
    subtitle: 'Simulation day adjuster, local persistence info, and demo data reset.',
    documentTitle: 'Settings & Demo | RupeeFlow',
  },
}

export function getRouteMetadata(pathname: string): RouteMeta {
  return (
    ROUTE_METADATA[pathname] || {
      title: 'RupeeFlow',
      subtitle: 'Make every rupee count.',
      documentTitle: 'RupeeFlow — Make Every Rupee Count',
    }
  )
}
