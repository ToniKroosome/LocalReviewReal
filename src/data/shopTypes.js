export const shopTypes = [
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    children: [
      {
        id: 'restaurants',
        name: 'Restaurants',
        children: [
          { id: 'thai', name: 'Thai' },
          { id: 'japanese', name: 'Japanese' },
          { id: 'italian', name: 'Italian' }
        ]
      },
      {
        id: 'cafes-desserts',
        name: 'Cafés & Desserts',
        children: [
          { id: 'coffee-shops', name: 'Coffee Shops' },
          { id: 'bakeries', name: 'Bakeries' }
        ]
      },
      {
        id: 'street-food',
        name: 'Street Food & Stalls',
        children: [
          { id: 'noodle-stalls', name: 'Noodle Stalls' },
          { id: 'skewers', name: 'Skewers' }
        ]
      }
    ]
  },
  {
    id: 'retail-shopping',
    name: 'Retail & Shopping',
    children: [
      {
        id: 'fashion-accessories',
        name: 'Fashion & Accessories',
        children: [
          { id: 'clothing', name: 'Clothing' },
          { id: 'shoes', name: 'Shoes' },
          { id: 'bags', name: 'Bags' }
        ]
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    children: [
      { id: 'schools', name: 'Schools' },
      { id: 'colleges', name: 'Colleges & Universities' }
    ]
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    children: [
      { id: 'bars', name: 'Bars' },
      { id: 'clubs', name: 'Night Clubs' }
    ]
  },
  {
    id: 'individuals',
    name: 'Individuals',
    children: [
      { id: 'teachers', name: 'Teachers' },
      { id: 'tutors', name: 'Tutors' },
      { id: 'public-figures', name: 'Public Figures' }
    ]
  }
];
