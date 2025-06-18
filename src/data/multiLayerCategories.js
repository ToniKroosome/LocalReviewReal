export const multiLayerCategories = {
  shop: [
    {
      id: 'food',
      label: 'Food',
      children: [
        {
          id: 'restaurant',
          label: 'Restaurant',
          children: [
            { id: 'italian', label: 'Italian' },
            { id: 'thai', label: 'Thai' }
          ]
        },
        {
          id: 'cafe',
          label: 'Cafe',
          children: [
            { id: 'coffee', label: 'Coffee Shop' }
          ]
        }
      ]
    },
    {
      id: 'retail',
      label: 'Retail',
      children: [
        {
          id: 'clothing',
          label: 'Clothing',
          children: [
            { id: 'mens', label: 'Mens' },
            { id: 'womens', label: 'Womens' }
          ]
        }
      ]
    }
  ],
  location: [
    {
      id: 'bangkok',
      label: 'Bangkok',
      children: [
        {
          id: 'sukhumvit',
          label: 'Sukhumvit',
          children: [
            { id: 'soi1', label: 'Soi 1' },
            { id: 'soi2', label: 'Soi 2' }
          ]
        }
      ]
    },
    {
      id: 'chiangmai',
      label: 'Chiang Mai',
      children: [
        {
          id: 'nimman',
          label: 'Nimman',
          children: [
            { id: 'lane1', label: 'Lane 1' },
            { id: 'lane2', label: 'Lane 2' }
          ]
        }
      ]
    }
  ]
};
