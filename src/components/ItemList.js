import React from 'react';
import { Sparkles } from 'lucide-react';
import ReviewItem from './ReviewItem';

const ItemList = ({
  filteredReviews,
  isAuthReady,
  handleItemClick,
  language,
  categories,
  citiesData,
  bangkokStreetsData,
  generatedImages,
  setGeneratedImages,
  isLoadingNoMatchingReviewsMessage,
  noMatchingReviewsMessage,
  generateImage,
}) => (
  <main className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {!isAuthReady ? (
        <div className="text-center py-20 col-span-full">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full mb-4">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-400">{language === 'en' ? 'Loading Reviews...' : 'กำลังโหลดรีวิว...'}</p>
        </div>
      ) : filteredReviews.length > 0 ? (
        filteredReviews.map((item) => (
          <ReviewItem
            key={item.id}
            generateImage={generateImage}
            item={item}
            onClick={handleItemClick}
            language={language}
            categories={categories}
            citiesData={citiesData}
            bangkokStreetsData={bangkokStreetsData}
            generatedImages={generatedImages}
            setGeneratedImages={setGeneratedImages}
          />
        ))
      ) : (
        <div className="text-center py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 col-span-full">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg">
            {isLoadingNoMatchingReviewsMessage ? (language === 'en' ? 'Searching...' : 'กำลังค้นหา...') : noMatchingReviewsMessage}
          </p>
        </div>
      )}
    </div>
  </main>
);

export default ItemList;
