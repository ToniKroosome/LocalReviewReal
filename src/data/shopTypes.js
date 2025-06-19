export const shopTypes = [
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    name_th: 'อาหารและเครื่องดื่ม',
    children: [
      {
        id: 'restaurants',
        name: 'Restaurants',
        name_th: 'ร้านอาหาร',
        children: [
          { id: 'thai', name: 'Thai', name_th: 'อาหารไทย' },
          { id: 'japanese', name: 'Japanese', name_th: 'อาหารญี่ปุ่น' },
          { id: 'italian', name: 'Italian', name_th: 'อาหารอิตาเลียน' }
        ]
      },
      {
        id: 'cafes-desserts',
        name: 'Cafés & Desserts',
        name_th: 'คาเฟ่และของหวาน',
        children: [
          { id: 'coffee-shops', name: 'Coffee Shops', name_th: 'ร้านกาแฟ' },
          { id: 'bakeries', name: 'Bakeries', name_th: 'เบเกอรี่' }
        ]
      },
      {
        id: 'street-food',
        name: 'Street Food & Stalls',
        name_th: 'อาหารข้างทางและแผงลอย',
        children: [
          { id: 'noodle-stalls', name: 'Noodle Stalls', name_th: 'ร้านก๋วยเตี๋ยว' },
          { id: 'skewers', name: 'Skewers', name_th: 'ไม้เสียบ' }
        ]
      }
    ]
  },
  {
    id: 'retail-shopping',
    name: 'Retail & Shopping',
    name_th: 'ค้าปลีกและช้อปปิ้ง',
    children: [
      {
        id: 'fashion-accessories',
        name: 'Fashion & Accessories',
        name_th: 'แฟชั่นและเครื่องประดับ',
        children: [
          { id: 'clothing', name: 'Clothing', name_th: 'เสื้อผ้า' },
          { id: 'shoes', name: 'Shoes', name_th: 'รองเท้า' },
          { id: 'bags', name: 'Bags', name_th: 'กระเป๋า' }
        ]
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    name_th: 'การศึกษา',
    children: [
      { id: 'schools', name: 'Schools', name_th: 'โรงเรียน' },
      { id: 'colleges', name: 'Colleges & Universities', name_th: 'มหาวิทยาลัย' }
    ]
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    name_th: 'สถานบันเทิงยามค่ำคืน',
    children: [
      { id: 'bars', name: 'Bars', name_th: 'บาร์' },
      { id: 'clubs', name: 'Night Clubs', name_th: 'ไนต์คลับ' }
    ]
  },
  {
    id: 'individuals',
    name: 'Individuals',
    name_th: 'บุคคล',
    children: [
      { id: 'teachers', name: 'Teachers', name_th: 'ครู' },
      { id: 'tutors', name: 'Tutors', name_th: 'ติวเตอร์' },
      { id: 'public-figures', name: 'Public Figures', name_th: 'คนดัง' }
    ]
  }
];
