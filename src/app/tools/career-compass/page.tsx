import Breadcrumbs from '@/components/Breadcrumbs';
import CareerCompassAssessment from '@/components/CareerCompassAssessment';

export const metadata = { title: 'Career Compass — Find Your Next Career Path', description: 'Explore 30 career signals and get a scored shortlist with skills gaps, projects, and a practical learning plan.' };

export default function CareerCompassPage() {
  return <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
    <Breadcrumbs items={[{ name: 'Career Tools', url: '/#skills-catalog' }, { name: 'Career Compass' }]} />
    <div className="mx-auto max-w-2xl space-y-3 text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-purple-300">Clarity starts with you</p><h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Find your next direction.</h1><p className="text-sm leading-6 text-slate-400">Discover career paths that fit who you are and where you want to go.</p></div>
    <CareerCompassAssessment />
  </div>;
}
