// 'use client';

// import { StateCard } from '@/components/states/state-card';
// import { US_STATES } from '@/lib/states';

// export function StatesGrid() {
//   console.log('US_STATES:', US_STATES);
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6">
//       {US_STATES.map((state) => (
//         <StateCard key={state} state={state} />
//       ))}
//     </div>
//   );
// }

import { StateCard } from '@/components/states/state-card';

interface StatesGridProps {
  states: string[];
}

export function StatesGrid({ states }: StatesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6">
      {states.map((state) => (
        <StateCard key={state} state={state} />
      ))}
    </div>
  );
}
