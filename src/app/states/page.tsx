// import { StatesGrid } from '@/components/states/states-grid';
// import { StatesHeader } from '@/components/states/states-header';

// export default function StatesPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <StatesHeader />
//       <div className="container py-8">
//         <StatesGrid />
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from 'react';
import { StatesGrid } from '@/components/states/states-grid';
import { StatesHeader } from '@/components/states/states-header';
import { US_STATES } from '@/lib/states';

export default function StatesPage() {
  const [filteredStates, setFilteredStates] = useState<string[]>([...US_STATES]);

  const filterStates = (searchTerm: string) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    console.log('searchTerm:', searchTerm);
    console.log("lowercaseTerm:", lowerCaseTerm);
    const filtered = US_STATES.filter((state) =>
      state.toLowerCase().includes(lowerCaseTerm)
    );

    setFilteredStates(filtered);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StatesHeader filterStates={filterStates} />
      <div className="container py-8">
        <StatesGrid states={filteredStates} />
      </div>
    </div>
  );
}
