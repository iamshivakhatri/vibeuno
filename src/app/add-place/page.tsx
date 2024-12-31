import { AddPlaceForm } from '@/components/places/add-place-form';

export default function AddPlacePage() {
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Share a Place</h1>
      <AddPlaceForm />
    </div>
  );
}