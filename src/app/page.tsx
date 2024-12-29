import Link from 'next/link';

const locations = ['Missouri', 'California', 'New York']; // Mock states

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Discover the Best Places</h1>
      <ul className="space-y-4">
        {locations.map((location) => (
          <li key={location}>
            <Link href={`/${location.toLowerCase()}`} className="text-blue-500 hover:underline text-xl">
              {location}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
