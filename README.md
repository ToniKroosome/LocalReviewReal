import React, { useState } from 'react';
import './App.css';

import CategoryTabs from './components/CategoryTabs';
import MultiLayerToggleDemo from './components/MultiLayerToggleDemo';
import Dropdown from './components/Dropdown';
import CompactReviewCard from './components/CompactReviewCard';
import ReviewFormModal from './components/ReviewFormModal';

import categories from './data/categories';
import citiesData from './data/citiesData';
import bangkokStreetsData from './data/bangkokStreetsData';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    mainCategory: '',
    category: '',
    subCategory: '',
    city: '',
    district: '',
    detail: '',
    tags: ['เปิดดึก', 'คนซ่อมใจดี'],
    rating: 0,
  });

  const handleSubmit = () => {
    console.log('Submitted:', newReview);
    setShowModal(false);
  };

  const exampleItem = {
    id: 'sample-1',
    itemName: 'Local Car Repair',
    mainCategory: 'Real World',
    category: 'Local Services',
    subCategory: 'Mechanics',
    location: { city: 'Bangkok', district: 'Lat Phrao' },
    rating: 4.5,
    reviewCount: 23,
    reviews: [
      {
        id: 1,
        author: 'Sarah K.',
        rating: 5,
        date: '2024-03-15',
        comment: 'Quick and honest car repair.',
        verified: true,
        helpful: 15,
      },
    ],
  };

  return (
    <div className="App p-4">
      <h1 className="text-xl font-bold mb-4">รีวิวท้องถิ่น</h1>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        เขียนรีวิว
      </button>

      <CategoryTabs />
      <MultiLayerToggleDemo />
      <Dropdown options={['One', 'Two', 'Three']} onSelect={(o) => console.log(o)} />
      <CompactReviewCard item={exampleItem} onDetails={() => {}} />

      <ReviewFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        newReview={newReview}
        setNewReview={setNewReview}
        onSubmit={handleSubmit}
        categories={categories}
        citiesData={citiesData}
        bangkokStreetsData={bangkokStreetsData}
        language="th"
      />
    </div>
  );
}

export default App;

## Language Toggle

`CompactReviewCard` accepts a `language` prop to render comments in English (`review.comment`) or Thai (`review.comment_th`). Pass the current app language when rendering the card.

```jsx
<CompactReviewCard item={exampleItem} onDetails={() => {}} language="th" />
```

## Dropdown

`Dropdown` shows a small trigger button but expands into a large scrollable menu. Use it like this:

```jsx
<Dropdown options={['One', 'Two', 'Three']} onSelect={(o) => console.log(o)} />
```

Menu and trigger styles are defined in `src/styles/Dropdown.css`.
