// AddPlaceForm.tsx (Client-Side)
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addPlace } from '@/actions/place';
import { useRouter } from 'next/navigation';
import { US_STATES } from '@/lib/states';
import { toast } from '@/hooks/use-toast';

export function AddPlaceForm() {
  const router = useRouter();
  // const { user } = useAuth(); // Commented out for now, you will replace it with Clerk later.
  
  // For now, using a hardcoded user ID (replace it with Clerk later)
  const user = { id: 'cm5arfdhb0000rpvgmzygckb2' };

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    description: '',
    category: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated (this will be replaced by Clerk later)
    if (!user) {
      toast({ title: "Please sign in to add a place", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the addPlace action with the userId
      await addPlace({ ...formData, userId: user.id });
      toast({ title: "Place added successfully!" });
      router.push(`/states/${formData.state.toLowerCase().replace(/\s+/g, '-')}`);
    } catch (error) {
      toast({ title: "Failed to add place", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Place name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Select
          value={formData.state}
          onValueChange={(value) => setFormData({ ...formData, state: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />

        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nature">Nature</SelectItem>
            <SelectItem value="culture">Culture</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <Input
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adding Place...' : 'Add Place'}
      </Button>
    </form>
  );
}
