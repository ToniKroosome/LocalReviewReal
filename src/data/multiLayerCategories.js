export const multiLayerCategories = {
  shop: [
    {
      id: 'food',
      label: 'Food',
      label_th: 'อาหาร',
      children: [
        {
          id: 'restaurant',
          label: 'Restaurant',
          label_th: 'ร้านอาหาร',
          children: [
            { id: 'italian', label: 'Italian', label_th: 'อิตาเลียน' },
            { id: 'thai', label: 'Thai', label_th: 'อาหารไทย' }
          ]
        },
        {
          id: 'cafe',
          label: 'Cafe',
          label_th: 'คาเฟ่',
          children: [
            { id: 'coffee', label: 'Coffee Shop', label_th: 'ร้านกาแฟ' }
          ]
        }
      ]
    },
    {
      id: 'retail',
      label: 'Retail',
      label_th: 'ค้าปลีก',
      children: [
        {
          id: 'clothing',
          label: 'Clothing',
          label_th: 'เสื้อผ้า',
          children: [
            { id: 'mens', label: 'Mens', label_th: 'ผู้ชาย' },
            { id: 'womens', label: 'Womens', label_th: 'ผู้หญิง' }
          ]
        }
      ]
    }
  ],
  location: [
    {
      id: 'bangkok',
      label: 'Bangkok',
      label_th: 'กรุงเทพฯ',
      children: [
        {
          id: 'sukhumvit',
          label: 'Sukhumvit',
          label_th: 'สุขุมวิท',
          children: [
            { id: 'soi1', label: 'Soi 1', label_th: 'ซอย 1' },
            { id: 'soi2', label: 'Soi 2', label_th: 'ซอย 2' }
          ]
        }
      ]
    },
    {
      id: 'chiangmai',
      label: 'Chiang Mai',
      label_th: 'เชียงใหม่',
      children: [
        {
          id: 'nimman',
          label: 'Nimman',
          label_th: 'นิมมาน',
          children: [
            { id: 'lane1', label: 'Lane 1', label_th: 'ซอย 1' },
            { id: 'lane2', label: 'Lane 2', label_th: 'ซอย 2' }
          ]
        }
      ]
    }
  ]
};