export interface Category {
  id: string;
  label: string;
  color?: string;
  subCategories?: Category[];
}

export const navigationCategories: Category[] = [
  {
    id: 'offline',
    label: 'Offline',
    color: '#FF7043',
    subCategories: [
      { id: 'local-services', label: 'Local Services' },
      { id: 'restaurants-cafes', label: 'Restaurants & Cafes' },
      { id: 'retail-stores', label: 'Retail Stores' },
      { id: 'facebook-marketplace', label: 'Facebook Marketplace' },
      { id: 'education', label: 'Education' }
    ]
  },
  {
    id: 'online',
    label: 'Online',
    color: '#42A5F5',
    subCategories: [
      {
        id: 'social-media',
        label: 'Social Media',
        subCategories: [
          { id: 'facebook', label: 'Facebook' },
          { id: 'instagram', label: 'Instagram' },
          { id: 'twitter', label: 'Twitter' },
          { id: 'tiktok', label: 'TikTok' },
          { id: 'youtube', label: 'YouTube' }
        ]
      },
      { id: 'website', label: 'Website' },
      { id: 'remote-services', label: 'Individual Remote Services' }
    ]
  }
];
