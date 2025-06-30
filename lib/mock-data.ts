export type Property = {
  id: string;
  title: string;
  type: 'Apartment' | 'Bungalow' | 'Townhouse';
  price: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    city: string;
    county: string;
    address: string;
  };
  imageUrls: string[];
  agentInfo: {
    isVerified: boolean;
  };
};

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Spacious 2-Bedroom in Kilimani',
    type: 'Apartment',
    price: 75000,
    bedrooms: 2,
    bathrooms: 2,
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      address: 'Near Yaya Centre',
    },
    imageUrls: ['https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    agentInfo: {
      isVerified: true,
    },
  },
  {
    id: '2',
    title: 'Cozy Family Home in Karen',
    type: 'Bungalow',
    price: 150000,
    bedrooms: 4,
    bathrooms: 3,
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      address: 'Hardy',
    },
    imageUrls: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    agentInfo: {
      isVerified: false,
    },
  },
  {
    id: '3',
    title: 'Modern Townhouse in Westlands',
    type: 'Townhouse',
    price: 220000,
    bedrooms: 5,
    bathrooms: 5,
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      address: 'Rhapta Road',
    },
    imageUrls: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    agentInfo: {
      isVerified: true,
    },
  },
  {
    id: '4',
    title: 'Affordable Bedsitter in Rongai',
    type: 'Apartment',
    price: 12000,
    bedrooms: 1,
    bathrooms: 1,
    location: {
      city: 'Rongai',
      county: 'Kajiado',
      address: 'Tumaini area',
    },
    imageUrls: ['https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    agentInfo: {
      isVerified: false,
    },
  },
];
