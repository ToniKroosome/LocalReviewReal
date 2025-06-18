import StarRating from './components/StarRating';
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Camera, CheckCircle, User, TrendingUp, Calendar, Filter, Plus, X, ChevronDown, LogOut, Sparkles, MapPin, Globe, Heart, MessageCircle, Award, Clock, ArrowLeft } from 'lucide-react';
import { initialSampleReviews } from './data/sampleReviews';
import Header from './components/Header';
import ItemList from './components/ItemList';
import ItemDetailPage from './components/ItemDetailPage';

// --- Helper: Google Icon SVG ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


// Custom scrollbar hide styles
const scrollbarHideStyles = `
  <style id="scrollbar-styles">
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  </style>
`;

// Inject styles into document head once
if (typeof document !== 'undefined' && !document.getElementById('scrollbar-styles')) {
  document.head.insertAdjacentHTML('beforeend', scrollbarHideStyles);
}


// Mock Firebase for preview environment
// In a real application, you would initialize Firebase here and use its actual SDK methods.
// MOCK USER DATA
const mockUser = {
    uid: 'mock-google-user-123',
    displayName: 'Demo User',
    photoURL: 'https://placehold.co/100x100/8e44ad/ffffff?text=DU'
};

// Mock Firebase for preview environment
const mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
        const user = mockAuth.currentUser;
        setTimeout(() => callback(user), 100);
        return () => {};
    },
    // SIMULATE Google Sign-In
    signInWithGoogle: () => {
        mockAuth.currentUser = mockUser;
        return Promise.resolve({ user: mockAuth.currentUser });
    },
    signOut: () => {
        mockAuth.currentUser = null;
        return Promise.resolve();
    }
};

const mockFirestore = {
    collection: (path) => ({
        query: () => ({
            onSnapshot: (callback) => {
                setTimeout(() => {
                    callback({
                        docs: initialSampleReviews.map((item) => ({
                            id: item.id,
                            data: () => item
                        }))
                    });
                }, 100);
                return () => {};
            }
        })
    }),
    addDoc: (collectionRef, data) => {
        console.log("Mock Firestore: addDoc called with", data);
        return Promise.resolve({ id: `mock-doc-${Date.now()}` });
    },
    setDoc: (docRef, data) => {
        console.log("Mock Firestore: setDoc called for", docRef.id, "with", data);
        return Promise.resolve();
    },
    getDocs: (q) => Promise.resolve({ docs: initialSampleReviews.map((item) => ({ id: item.id, data: () => item })) }),
    doc: (collectionRef, id) => ({ id: id })
};

// Mocked Firebase functions
const auth = mockAuth;
const db = mockFirestore;
// --- Firebase shims (fixed) ---
const collection = (path) => mockFirestore.collection(path);
const query      = (collectionRef) => collectionRef.query();
const onSnapshot = (queryRef, callback) => queryRef.onSnapshot(callback);
const doc        = (collectionRef, id) => mockFirestore.doc(collectionRef, id);
const setDoc     = mockFirestore.setDoc;
const addDoc     = mockFirestore.addDoc;
const getDocs    = (queryRef) => mockFirestore.getDocs(queryRef);
const onAuthStateChanged = (authInstance, callback) => mockAuth.onAuthStateChanged(callback);
const signInWithGoogle = mockAuth.signInWithGoogle; // Use the mock Google sign-in
const signOut = mockAuth.signOut;

const appId = 'preview-app-id';

// Function to generate image using Imagen API
const generateImage = async (prompt) => {
    try {
        const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1} };
        const apiKey = ""; // Canvas will automatically provide the API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorDetails = `Status: ${response.status}`;
            try {
                const errorBody = await response.text();
                errorDetails += `, Body: ${errorBody}`;
            } catch (readError) {
                errorDetails += `, Failed to read response body`;
            }
            throw new Error(`API call failed: ${errorDetails}`);
        }

        const result = await response.json();

        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        } else {
            console.error("Image generation failed or returned no data:", result);
            return null;
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};






// Enhanced ReviewFormModal Component
const ReviewFormModal = ({ show, onClose, newReview, setNewReview, onSubmit, categories, citiesData, bangkokStreetsData, language }) => {
    if (!show) return null;

    const selectedMainCategoryObj = categories.find(cat => cat.value === newReview.mainCategory);
    const categoriesForForm = selectedMainCategoryObj?.subcategories || selectedMainCategoryObj?.platforms || [];

    let subcategoriesOrPlatformsForForm = [];
    if (newReview.mainCategory === 'Online') {
        const selectedPlatformObj = categoriesForForm.find(p => p.value === newReview.category);
        subcategoriesOrPlatformsForForm = selectedPlatformObj?.subcategories || [];
    } else if (newReview.mainCategory === 'Real World') {
        const selectedCategoryObj = categoriesForForm.find(c => c.value === newReview.category);
        subcategoriesOrPlatformsForForm = selectedCategoryObj?.subcategories || [];
    }

    const selectedCityInForm = citiesData.find(city => city.value === newReview.location.city);
    const districtsForForm = selectedCityInForm?.districts || [];

    const selectedDistrictInForm = districtsForForm.find(d => d.value === newReview.location.district);
    const zonesForForm = selectedDistrictInForm?.zones || [];

    const selectedZoneInForm = zonesForForm.find(z => z.value === newReview.location.zone);
    const subDistrictsForForm = selectedZoneInForm ? (selectedDistrictInForm?.subDistricts.filter(sd => selectedZoneInForm.khwaengValues.includes(sd.value)) || []) : (selectedDistrictInForm?.subDistricts || []);

    const getStreetsForCurrentLocation = () => {
        if (newReview.location.city !== 'Bangkok') return [];

        let relevantKhwaengs = [];
        if (newReview.location.subDistrict) {
            relevantKhwaengs.push(newReview.location.subDistrict);
        } else if (newReview.location.zone && selectedZoneInForm) {
            relevantKhwaengs = selectedZoneInForm.khwaengValues;
        } else if (newReview.location.district && selectedDistrictInForm) {
            relevantKhwaengs = selectedDistrictInForm.subDistricts.map(sd => sd.value);
        }

        if (relevantKhwaengs.length === 0) { // If no specific sub-location is chosen, return all Bangkok streets
            return bangkokStreetsData;
        }

        const streets = bangkokStreetsData.filter(street => 
            street.associatedKhwaengs && street.associatedKhwaengs.some(khwaeng => relevantKhwaengs.includes(khwaeng))
        );
        return streets;
    };

    const streetsForForm = getStreetsForCurrentLocation();

    const selectedStreetInForm = streetsForForm.find(s => s.value === newReview.location.street);
const alleysForForm = selectedStreetInForm?.alleys || [];

    const inputClasses = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-300";

    const showLocationFields = newReview.mainCategory === 'Real World';
    
    const generateTags = () => {
        const tags = [];
        
        // Main Category
        if (newReview.mainCategory) {
            const mainCat = categories.find(c => c.value === newReview.mainCategory);
            if (mainCat) tags.push(language === 'en' ? mainCat.label : mainCat.label_th);
        }
    
        // Category / Platform
        if (newReview.category && selectedMainCategoryObj) {
            const catList = selectedMainCategoryObj.platforms || selectedMainCategoryObj.subcategories || [];
            const cat = catList.find(c => c.value === newReview.category);
            if (cat) tags.push(language === 'en' ? cat.label : cat.label_th);
        }
    
        // Sub-Category
        if (newReview.subCategory && subcategoriesOrPlatformsForForm.length > 0) {
            const subCat = subcategoriesOrPlatformsForForm.find(sc => sc.value === newReview.subCategory);
            if (subCat) tags.push(language === 'en' ? subCat.label : subCat.label_th);
        }
    
        // Location tags
        if (showLocationFields) {
            if (newReview.location.city) {
                const city = citiesData.find(c => c.value === newReview.location.city);
                if(city) tags.push(language === 'en' ? city.label : city.label_th);
            }
            if (newReview.location.district) {
                 const dist = districtsForForm.find(d => d.value === newReview.location.district);
                if(dist) tags.push(language === 'en' ? dist.label : dist.label_th);
            }
            if (newReview.location.zone) {
                const zn = zonesForForm.find(z => z.value === newReview.location.zone);
                if(zn) tags.push(language === 'en' ? zn.label : zn.label_th);
            }
             if (newReview.location.subDistrict) {
                const subDist = subDistrictsForForm.find(sd => sd.value === newReview.location.subDistrict);
                if(subDist) tags.push(language === 'en' ? subDist.label : subDist.label_th);
            }
             if (newReview.location.street) {
                const str = streetsForForm.find(s => s.value === newReview.location.street);
                if(str) tags.push(language === 'en' ? str.label : str.label_th);
            }
             if (newReview.location.alley) {
                const al = alleysForForm.find(a => a.value === newReview.location.alley);
                if(al) tags.push(language === 'en' ? al.label : al.label_th);
            }
            if (newReview.location.specificArea) {
                 tags.push(newReview.location.specificArea);
            }
        } else { // Online
             if (newReview.location.specificArea) { // URL/Handle
                 tags.push(newReview.location.specificArea);
             }
        }
    
        return tags.filter(Boolean); // Remove any null/undefined entries
    }

    const generatedTags = generateTags();


    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-gray-100 max-h-[90vh] overflow-y-auto border border-gray-700/50 scrollbar-hide">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">{language === 'en' ? "Write a Review" : "เขียนรีวิว"}</h2>
                        <p className="text-sm text-gray-400 mt-1">{language === 'en' ? "Share your experience" : "แบ่งปันประสบการณ์ของคุณ"}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300 hover:rotate-90 transition-all duration-300"
                        aria-label={language === 'en' ? "Close review form" : "ปิดแบบฟอร์มรีวิว"}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "What are you reviewing?" : "คุณกำลังรีวิวอะไร?"}
                        </label>
                        <input
                            type="text"
                            id="itemName"
                            value={newReview.itemName}
                            onChange={(e) => setNewReview({...newReview, itemName: e.target.value})}
                            placeholder={language === 'en' ? "e.g., John's Used Cars, @foodie_reviews_ny" : "เช่น รถมือสองของจอห์น, @รีวิวของอร่อยนิวยอร์ก"}
                            className={inputClasses}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="mainCategory" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Main Category" : "หมวดหมู่หลัก"}
                        </label>
                        <select
                            id="mainCategory"
                            value={newReview.mainCategory}
                            onChange={(e) => setNewReview({
                                ...newReview,
                                mainCategory: e.target.value,
                                category: '',
                                subCategory: '',
                                location: { 
                                    city: e.target.value === 'Online' ? 'Online' : (e.target.value === 'Real World' ? 'Bangkok' : ''),
                                    district: '', 
                                    zone: '', 
                                    subDistrict: '',
                                    street: '',
                                    alley: '',
                                    specificArea: ''
                                }
                            })}
                        className={inputClasses}
                        >
                            <option value="">{language === 'en' ? "Select a main category" : "เลือกหมวดหมู่หลัก"}</option>
                            {categories.filter(cat => cat.isTopLevel).map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.icon} {language === 'en' ? cat.label : cat.label_th}
                                </option>
                            ))}
                        </select>
                    </div>

                    {newReview.mainCategory && categoriesForForm.length > 0 && (
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-300 mb-2">
                                {newReview.mainCategory === 'Online' ? (language === 'en' ? 'Platform' : 'แพลตฟอร์ม') : (language === 'en' ? 'Category' : 'หมวดหมู่')}
                            </label>
                            <select
                                id="category"
                                value={newReview.category}
                                onChange={(e) => setNewReview({...newReview, category: e.target.value, subCategory: ''})}
                        className={inputClasses}
                            >
                                <option value="">{newReview.mainCategory === 'Online' ? (language === 'en' ? 'Select a platform' : 'เลือกแพลตฟอร์ม') : (language === 'en' ? 'Select a category' : 'เลือกหมวดหมู่')}</option>
                                {categoriesForForm.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {language === 'en' ? cat.label : cat.label_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {newReview.category && subcategoriesOrPlatformsForForm.length > 0 && (
                        <div>
                            <label htmlFor="subCategory" className="block text-sm font-semibold text-gray-300 mb-2">
                                {language === 'en' ? "Subcategory (Optional)" : "หมวดหมู่ย่อย (ไม่บังคับ)"}
                            </label>
                            <select
                                id="subCategory"
                                value={newReview.subCategory}
                                onChange={(e) => setNewReview({...newReview, subCategory: e.target.value})}
                        className={inputClasses}
                            >
                                <option value="">{language === 'en' ? "Select a subcategory" : "เลือกหมวดหมู่ย่อย"}</option>
                                {subcategoriesOrPlatformsForForm.map((subCat) => (
                                    <option key={subCat.value} value={subCat.value}>
                                        {language === 'en' ? subCat.label : subCat.label_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {showLocationFields && (
                        <div className="space-y-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                            <p className="text-sm font-semibold text-gray-300">{language === 'en' ? "Location Details" : "รายละเอียดสถานที่"}</p>
                            
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                                    {language === 'en' ? "City" : "เมือง"}
                                </label>
                                <select
                                    id="city"
                                    value={newReview.location.city}
                                    onChange={(e) => setNewReview({...newReview, location: {...newReview.location, city: e.target.value, district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: ''}})}
                        className={inputClasses}
                                >
                                    <option value="">{language === 'en' ? "Select a city" : "เลือกเมือง"}</option>
                                    {citiesData.filter(c => c.value !== 'Online').map((city) => (
                                        <option key={city.value} value={city.value}>
                                            {language === 'en' ? city.label : city.label_th}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {newReview.location.city === 'Bangkok' && districtsForForm.length > 0 && (
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "District" : "เขต"}
                                    </label>
                                    <select
                                        id="district"
                                        value={newReview.location.district}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, district: e.target.value, zone: '', subDistrict: '', street: '', alley: '', specificArea: ''}})}
                        className={inputClasses}
                                    >
                                        <option value="">{language === 'en' ? "Select a district" : "เลือกเขต"}</option>
                                        {districtsForForm.map((district) => (
                                            <option key={district.value} value={district.value}>
                                                {language === 'en' ? district.label : district.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {newReview.location.district && zonesForForm.length > 0 && (
                                <div>
                                    <label htmlFor="zone" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Zone (Optional)" : "โซน (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="zone"
                                        value={newReview.location.zone}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, zone: e.target.value, subDistrict: '', street: '', alley: '', specificArea: ''}})}
                        className={inputClasses}
                                    >
                                        <option value="">{language === 'en' ? "Select a zone" : "เลือกโซน"}</option>
                                        {zonesForForm.map((zone) => (
                                            <option key={zone.value} value={zone.value}>
                                                {language === 'en' ? zone.label : zone.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(newReview.location.district || newReview.location.zone) && subDistrictsForForm.length > 0 && (
                                <div>
                                    <label htmlFor="subDistrict" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Sub-District (Optional)" : "แขวง/ตำบล (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="subDistrict"
                                        value={newReview.location.subDistrict}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, subDistrict: e.target.value, street: '', alley: '', specificArea: ''}})}
                        className={inputClasses}
                                    >
                                        <option value="">{language === 'en' ? "Select a sub-district" : "เลือกแขวง/ตำบล"}</option>
                                        {subDistrictsForForm.map((subDistrict) => (
                                            <option key={subDistrict.value} value={subDistrict.value}>
                                                {language === 'en' ? subDistrict.label : subDistrict.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {/* STREET FIELD: Always show if Bangkok is selected and streets are available */}
                            {newReview.location.city === 'Bangkok' && streetsForForm.length > 0 && (
                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Street (Optional)" : "ถนน (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="street"
                                        value={newReview.location.street}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, street: e.target.value, alley: '', specificArea: ''}})}
                        className={inputClasses}
                                    >
                                        <option value="">{language === 'en' ? "Select a street" : "เลือกถนน"}</option>
                                        {streetsForForm.map((street) => (
                                            <option key={street.value} value={street.value}>
                                                {language === 'en' ? street.label : street.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ALLEY FIELD: Show only if a specific street is selected and alleys exist */}
                            {newReview.location.street && alleysForForm.length > 0 && (
                                <div>
                                    <label htmlFor="alley" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Alley (Optional)" : "ซอย (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="alley"
                                        value={newReview.location.alley}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, alley: e.target.value, specificArea: ''}})}
                        className={inputClasses}
                                    >
                                        <option value="">{language === 'en' ? "Select an alley" : "เลือกซอย"}</option>
                                        {alleysForForm.map((alley) => (
                                            <option key={alley.value} value={alley.value}>
                                                {language === 'en' ? alley.label : alley.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(newReview.location.subDistrict || newReview.location.alley || newReview.location.street || newReview.location.zone || newReview.location.district) && (
                                <div>
                                    <label htmlFor="specificArea" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Specific Area / Landmark (Optional)" : "พื้นที่เฉพาะ / สถานที่สำคัญ (ไม่บังคับ)"}
                                    </label>
                                    <input
                                        type="text"
                                        id="specificArea"
                                        value={newReview.location.specificArea}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, specificArea: e.target.value}})}
                                        placeholder={language === 'en' ? "e.g., Near Central Embassy, Soi 21 Building A" : "เช่น ใกล้เซ็นทรัลเอ็มบาสซี, ซอย 21 ตึก A"}
                        className={inputClasses}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {newReview.mainCategory === 'Online' && (
                        <div>
                            <label htmlFor="specificAreaOnline" className="block text-sm font-semibold text-gray-300 mb-2">
                                {language === 'en' ? "Online URL / Handle" : "URL / ชื่อผู้ใช้"}
                            </label>
                            <input
                                type="text"
                                id="specificAreaOnline"
                                value={newReview.location.specificArea}
                                onChange={(e) => setNewReview({...newReview, location: {...newReview.location, specificArea: e.target.value}})}
                                placeholder={language === 'en' ? "e.g., youtube.com/@influencername" : "เช่น youtube.com/@ชื่ออินฟลูเอนเซอร์"}
                        className={inputClasses}
                            />
                        </div>
                    )}

                    {generatedTags.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                {language === 'en' ? "Generated Tags" : "แท็กที่สร้างขึ้น"}
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                                {generatedTags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            {language === 'en' ? "Rating" : "คะแนน"}
                        </label>
                        <div className="flex justify-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                            <StarRating 
                                rating={newReview.rating} 
                                size="lg" 
                                interactive={true} 
                                onRate={(rating) => setNewReview({...newReview, rating})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="comment" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Your Review" : "รีวิวของคุณ"}
                        </label>
                        <textarea
                            id="comment"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            rows={4}
                            placeholder={language === 'en' ? "Share your experience..." : "แบ่งปันประสบการณ์ของคุณ..."}
                        className={inputClasses + " resize-none"}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="author" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Your Name" : "ชื่อของคุณ"}
                        </label>
                        <input
                            type="text"
                            id="author"
                            value={newReview.author}
                            onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                            placeholder={language === 'en' ? "John D." : "สมชาย ดี"}
                        className={inputClasses}
                        />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => console.log(language === 'en' ? 'Photo upload functionality would be implemented here.' : 'ฟังก์ชันอัปโหลดรูปภาพจะถูกนำมาใช้ที่นี่')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl hover:bg-gray-800/50 border-gray-700 text-gray-300 hover:text-gray-100 transition-all duration-300 backdrop-blur-sm"
                        >
                            <Camera size={20} />
                            {language === 'en' ? "Add Photos" : "เพิ่มรูปภาพ"}
                        </button>
                        <button
                            onClick={() => onSubmit(newReview)}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {language === 'en' ? "Submit Review" : "ส่งรีวิว"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main App Component with enhanced design
const App = () => {
    const [page, setPage] = useState('home'); // 'home' or 'detail'
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState('en');
    const [selectedMainCategory, setSelectedMainCategory] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');
    const [selectedCityFilter, setSelectedCityFilter] = useState('all');
    const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('all');
    const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');
    const [selectedSubDistrictFilter, setSelectedSubDistrictFilter] = useState('all');
    const [selectedStreetFilter, setSelectedStreetFilter] = useState('all');
    const [selectedAlleyFilter, setSelectedAlleyFilter] = useState('all');
    const [selectedSpecificAreaFilter, setSelectedSpecificAreaFilter] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null); // Changed from userId to user object
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [noMatchingReviewsMessage, setNoMatchingReviewsMessage] = useState('');
    const [isLoadingNoMatchingReviewsMessage, setIsLoadingNoMatchingReviewsMessage] = useState(false);
    const [generatedImages, setGeneratedImages] = useState({}); // State for dynamically generated images
    // Visibility states for search and filter UI controlled by Header buttons
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const toggleSearchBar = () => setShowSearchBar(v => !v);
    const toggleFilters = () => setShowFilters(v => !v);

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 40) setShowHeader(true);
            else if (window.scrollY > lastScrollY) setShowHeader(false);
            else setShowHeader(true);
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);


    // Data structures remain the same
    const categories = [ { value: 'all', label: 'All Categories', label_th: 'ทุกหมวดหมู่', icon: '🌐', isTopLevel: true }, { value: 'Online', label: 'Online', label_th: 'ออนไลน์', icon: '💻', isTopLevel: true, platforms: [ { value: 'Facebook', label: 'Facebook', label_th: 'เฟซบุ๊ก', subcategories: [ { value: 'Influencer', label: 'Influencer', label_th: 'อินฟลูเอนเซอร์' }, { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, { value: 'Page', label: 'Page', label_th: 'เพจ' }, { value: 'Group', label: 'Group', label_th: 'กลุ่ม' }, ] }, { value: 'Shopee', label: 'Shopee', label_th: 'ช้อปปี้', subcategories: [ { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, { value: 'Seller', label: 'Seller', label_th: 'ผู้ขาย' }, ] }, { value: 'Instagram', label: 'Instagram', label_th: 'อินสตาแกรม', subcategories: [ { value: 'Influencer', label: 'Influencer', label_th: 'อินฟลูเอนเซอร์' }, { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, ] }, { value: 'TikTok', label: 'TikTok', label_th: 'ติ๊กต็อก', subcategories: [ { value: 'Influencer', label: 'Influencer', label_th: 'อินฟลูเอนเซอร์' }, { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, ] }, { value: 'YouTube', label: 'YouTube', label_th: 'ยูทูป', subcategories: [ { value: 'Channel', label: 'Channel', label_th: 'ช่อง' }, { value: 'Content Creator', label: 'Content Creator', label_th: 'ผู้สร้างเนื้อหา' }, ] }, { value: 'Telegram', label: 'Telegram', label_th: 'เทเลแกรม', subcategories: [ { value: 'Group', label: 'Group', label_th: 'กลุ่ม' }, { value: 'Channel', label: 'Channel', label_th: 'ช่อง' }, ] }, { value: 'Line', label: 'Line', label_th: 'ไลน์', subcategories: [ { value: 'Official Account', label: 'Official Account', label_th: 'บัญชีทางการ' }, { value: 'Group', label: 'Group', label_th: 'กลุ่ม' }, ] }, { value: 'Website', label: 'Website', label_th: 'เว็บไซต์', subcategories: [ { value: 'E-commerce', label: 'E-commerce', label_th: 'อีคอมเมิร์ซ' }, { value: 'Blog', label: 'Blog', label_th: 'บล็อก' }, { value: 'Forum', label: 'Forum', label_th: 'ฟอรั่ม' }, { value: 'Service Provider', label: 'Service Provider', label_th: 'ผู้ให้บริการ' }, ] }, { value: 'Online Service (General)', label: 'Online Service (General)', label_th: 'บริการออนไลน์ (ทั่วไป)' }, ] }, { value: 'Real World', label: 'Real World', label_th: 'โลกจริง', icon: '🌍', isTopLevel: true, subcategories: [ { value: 'Local Services', label: 'Local Services', label_th: 'บริการท้องถิ่น', icon: '🛠️', subcategories: [ { value: 'Movers', label: 'Movers', label_th: 'ผู้ให้บริการขนย้าย' }, { value: 'Tutors', label: 'Tutors', label_th: 'ติวเตอร์' }, { value: 'Handymen', label: 'Handymen', label_th: 'ช่างซ่อมบำรุง' }, { value: 'Cleaners', label: 'Cleaners', label_th: 'ผู้ให้บริการทำความสะอาด' }, { value: 'Plumbers', label: 'Plumbers', label_th: 'ช่างประปา' }, { value: 'Electricians', label: 'Electricians', label_th: 'ช่างไฟฟ้า' }, { value: 'Mechanics', label: 'Mechanics', label_th: 'ช่างยนต์' }, ] }, { value: 'Facebook Marketplace', label: 'Facebook Marketplace', label_th: 'ตลาด Facebook', icon: '🛒', subcategories: [ { value: 'Used Cars', label: 'Used Cars', label_th: 'รถยนต์มือสอง' }, { value: 'Used Furniture', label: 'Used Furniture', label_th: 'เฟอร์นิเจอร์มือสอง' }, { value: 'Used Electronics', label: 'Used Electronics', label_th: 'อุปกรณ์อิเล็กทรอนิกส์มือสอง' }, ] }, { value: 'Goods & Products', label: 'Goods & Products', label_th: 'สินค้าและผลิตภัณฑ์', icon: '📦', subcategories: [ { value: 'Used Clothing', label: 'Used Clothing', label_th: 'เสื้อผ้ามือสอง' }, { value: 'Used Electronics', label: 'Used Electronics', label_th: 'อุปกรณ์อิเล็กทรอนิกส์มือสอง' }, { value: 'Furniture', label: 'Furniture', label_th: 'เฟอร์นิเจอร์' }, { value: 'Antiques', label: 'Antiques', label_th: 'ของเก่า' }, { value: 'Collectibles', label: 'Collectibles', label_th: 'ของสะสม' }, ] }, { value: 'Landlords', label: 'Landlords', label_th: 'เจ้าของที่ดิน/อาคาร', icon: '🏠', subcategories: [ { value: 'Apartment', label: 'Apartment', label_th: 'อพาร์ตเมนต์' }, { value: 'Condo', label: 'Condo', label_th: 'คอนโด' }, { value: 'House', label: 'House', label_th: 'บ้าน' }, ] }, { value: 'Restaurants & Cafes', label: 'Restaurants & Cafes', label_th: 'ร้านอาหารและคาเฟ่', icon: '🍽️', subcategories: [ { value: 'Thai Food', label: 'Thai Food', label_th: 'อาหารไทย' }, { value: 'Japanese Food', label: 'Japanese Food', label_th: 'อาหารญี่ปุ่น' }, { value: 'Italian Food', label: 'Italian Food', label_th: 'อาหารอิตาเลียน' }, { value: 'Cafe', label: 'Cafe', label_th: 'คาเฟ่' }, { value: 'Street Food Stall', label: 'Street Food Stall', label_th: 'ร้านอาหารริมทาง' }, { value: 'Fine Dining', label: 'Fine Dining', label_th: 'ร้านอาหารหรู' }, ] }, { value: 'Retail Stores', label: 'Retail Stores', label_th: 'ร้านค้าปลีก', icon: '🛍️', subcategories: [ { value: 'Fashion Boutique', label: 'Fashion Boutique', label_th: 'ร้านบูติกเสื้อผ้า' }, { value: 'Electronics Store', label: 'Electronics Store', label_th: 'ร้านเครื่องใช้ไฟฟ้า' }, { value: 'Supermarket', label: 'Supermarket', label_th: 'ซูเปอร์มาร์เก็ต' }, { value: 'Convenience Store', label: 'Convenience Store', label_th: 'ร้านสะดวกซื้อ' }, ] }, { value: 'Education Centers', label: 'Education Centers', label_th: 'ศูนย์การศึกษา', icon: '🎓', subcategories: [ { value: 'Language School', label: 'Language School', label_th: 'โรงเรียนสอนภาษา' }, { value: 'Tutoring Center', label: 'Tutoring Center', label_th: 'ศูนย์กวดวิชา' }, { value: 'Workshop/Classes', label: 'Workshop/Classes', label_th: 'เวิร์คช็อป/คลาสเรียน' }, ] }, { value: 'Healthcare Services', label: 'Healthcare Services', label_th: 'บริการด้านสุขภาพ', icon: '🏥', subcategories: [ { value: 'Clinic', label: 'Clinic', label_th: 'คลินิก' }, { value: 'Hospital', label: 'Hospital', label_th: 'โรงพยาบาล' }, { value: 'Dentist', label: 'Dentist', label_th: 'ทันตแพทย์' }, { value: 'Pharmacy', label: 'Pharmacy', label_th: 'ร้านขายยา' }, ] }, ] } ];
    const citiesData = [ { value: 'Bangkok', label: 'Bangkok', label_th: 'กรุงเทพมหานคร', districts: [ { value: 'Sathorn', label: 'Sathorn', label_th: 'สาทร', zones: [ { value: 'Sathorn-Silom CBD', label: 'Sathorn-Silom CBD', label_th: 'สาทร-สีลม ศูนย์กลางธุรกิจ', khwaengValues: ['Thung Wat Don', 'Thung Maha Mek', 'Yan Nawa (Sathorn)', 'Chong Nonsi (Sathorn)', 'Suan Phlu'] }, { value: 'Riverside Area (Sathorn)', label: 'Riverside Area (Sathorn)', label_th: 'พื้นที่ริมแม่น้ำ (สาทร)', khwaengValues: ['Thung Wat Don', 'Yan Nawa (Sathorn)'] }, { value: 'Naradhiwas Area (Sathorn)', label: 'Naradhiwas Area (Sathorn)', label_th: 'พื้นที่นราธิวาส (สาทร)', khwaengValues: ['Thung Wat Don', 'Chong Nonsi (Sathorn)', 'Thung Maha Mek'] }, ], subDistricts: [ { value: 'Thung Wat Don', label: 'Thung Wat Don', label_th: 'ทุ่งวัดดอน' }, { value: 'Yan Nawa (Sathorn)', label: 'Yan Nawa', label_th: 'ยานนาวา' }, { value: 'Thung Maha Mek', label: 'Thung Maha Mek', label_th: 'ทุ่งมหาเมฆ' }, { value: 'Chong Nonsi (Sathorn)', label: 'Chong Nonsi', label_th: 'ช่องนนทรี' }, { value: 'Suan Phlu', label: 'Suan Phlu', label_th: 'สวนพลู' }, ] }, { value: 'Watthana', label: 'Watthana', label_th: 'วัฒนา', zones: [ { value: 'Sukhumvit Main Area (Watthana)', label: 'Sukhumvit Main Area', label_th: 'สุขุมวิทพื้นที่หลัก (วัฒนา)', khwaengValues: ['Khlong Toei Nuea', 'Phrom Phong', 'Thong Lo (Watthana)', 'Ekkamai (Watthana)', 'Khlong Tan Nuea'] }, { value: 'Asok-Nana Area', label: 'Asok-Nana Area', label_th: 'อโศก-นานา', khwaengValues: ['Khlong Toei Nuea'] }, { value: 'Phrom Phong - Thong Lo', label: 'Phrom Phong - ทองหล่อ', label_th: 'พร้อมพงษ์ - ทองหล่อ', khwaengValues: ['Phrom Phong', 'Thong Lo (Watthana)'] }, { value: 'Ekkamai Area', label: 'Ekkamai Area', label_th: 'เอกมัย', khwaengValues: ['Ekkamai (Watthana)', 'Khlong Tan Nuea'] }, ], subDistricts: [ { value: 'Khlong Toei Nuea', label: 'Khlong Toei Nuea', label_th: 'คลองเตยเหนือ' }, { value: 'Phrom Phong', label: 'Phrom Phong', label_th: 'พร้อมพงษ์' }, { value: 'Thong Lo (Watthana)', label: 'Thong Lo', label_th: 'ทองหล่อ' }, { value: 'Ekkamai (Watthana)', label: 'Ekkamai', label_th: 'เอกมัย' }, { value: 'Khlong Tan Nuea', label: 'Khlong Tan Nuea', label_th: 'คลองตันเหนือ' }, ] }, { value: 'Khlong Toei', label: 'Khlong Toei', label_th: 'คลองเตย', zones: [ { value: 'Sukhumvit Extension (Khlong Toei)', label: 'Sukhumvit Extension', label_th: 'สุขุมวิทส่วนขยาย (คลองเตย)', khwaengValues: ['Khlong Toei (Khwaeng)', 'Khlong Tan (Khlong Toei)', 'Phra Khanong (Khlong Toei)', 'Lumphini (Khlong Toei)'] }, { value: 'Port Area (Khlong Toei)', label: 'Port Area', label_th: 'พื้นที่ท่าเรือ (คลong Toei)', khwaengValues: ['Khlong Toei (Khwaeng)'] }, { value: 'Convention Center Area', label: 'Convention Center Area', label_th: 'พื้นที่ศูนย์ประชุม', khwaengValues: ['Khlong Toei (Khwaeng)'] }, ], subDistricts: [ { value: 'Khlong Toei (Khwaeng)', label: 'Khlong Toei', label_th: 'คลองเตย' }, { value: 'Khlong Tan (Khlong Toei)', label: 'Khlong Tan', label_th: 'คลองตัน' }, { value: 'Phra Khanong (Khlong Toei)', label: 'Phra Khanong', label_th: 'พระโขนง' }, { value: 'Lumphini (Khlong Toei)', label: 'Lumphini', label_th: 'ลุมพินี' }, ] }, { value: 'Lat Phrao', label: 'Lat Phrao', label_th: 'ลาดพร้าว', zones: [ { value: 'Ladprao Main Road Area', label: 'Ladprao Main Road Area', label_th: 'พื้นที่ถนนลาดพร้าวสายหลัก', khwaengValues: ['Lat Phrao (Khwaeng)'] }, { value: 'Ladprao Soi Areas', label: 'Ladprao Soi Areas', label_th: 'พื้นที่ซอยลาดพร้าว', khwaengValues: ['Lat Phrao (Khwaeng)', 'Chorakhe Bua'] }, { value: 'Chok Chai 4 Area', label: 'Chok Chai 4 Area', label_th: 'พื้นที่โชคชัย 4', khwaengValues: ['Lat Phrao (Khwaeng)'] }, ], subDistricts: [ { value: 'Lat Phrao (Khwaeng)', label: 'Lat Phrao', label_th: 'ลาดพร้าว' }, { value: 'Chorakhe Bua', label: 'Chorakhe Bua', label_th: 'จระเข้บัว' }, ] }, ] }, { value: 'Online', label: 'Online', label_th: 'ออนไลน์', districts: [] }, ];
    const bangkokStreetsData = [ { value: 'Sukhumvit Road', label: 'Sukhumvit Road', label_th: 'ถนนสุขุมวิท', alleys: [ { value: 'Sukhumvit Soi 1', label: 'Sukhumvit Soi 1', label_th: 'สุขุมวิท ซอย 1' }, { value: 'Sukhumvit Soi 3 (Soi Nana Nuea)', label: 'Sukhumvit Soi 3 (Nana Nuea)', label_th: 'สุขุมวิท ซอย 3 (นานาเหนือ)' }, { value: 'Sukhumvit Soi 11', label: 'Sukhumvit Soi 11', label_th: 'สุขุมวิท ซอย 11' }, { value: 'Sukhumvit Soi 21 (Soi Asok)', label: 'Sukhumvit Soi 21 (Asok)', label_th: 'สุขุมวิท ซอย 21 (อโศก)' }, ], associatedKhwaengs: ['Khlong Toei Nuea', 'Phrom Phong', 'Thong Lo (Watthana)', 'Ekkamai (Watthana)', 'Khlong Tan Nuea', 'Khlong Toei (Khwaeng)', 'Phra Khanong (Khlong Toei)'] }, { value: 'Lat Phrao Road', label: 'Lat Phrao Road', label_th: 'ถนนลาดพร้าว', alleys: [ { value: 'Lat Phrao Soi 1', label: 'Lat Phrao Soi 1', label_th: 'ลาดพร้าว ซอย 1' }, { value: 'Lat Phrao Soi 71', label: 'Lat Phrao Soi 71', label_th: 'ลาดพร้าว ซอย 71' }, { value: 'Lat Phrao Soi 101', label: 'Lat Phrao Soi 101', label_th: 'ลาดพร้าว ซอย 101' }, ], associatedKhwaengs: ['Lat Phrao (Khwaeng)', 'Chorakhe Bua'] }, { value: 'Silom Road', label: 'Silom Road', label_th: 'ถนนสีลม', alleys: [ { value: 'Silom Soi 1', label: 'Silom Soi 1', label_th: 'สีลม ซอย 1' }, { value: 'Silom Soi 9', label: 'Silom Soi 9', label_th: 'สีลม ซอย 9' }, ], associatedKhwaengs: ['Silom', 'Suriyawong', 'Si Phraya'] }, ];

    const [newReview, setNewReview] = useState({
        itemName: '',
        mainCategory: '',   
        category: '',   
        subCategory: '',    
        location: { city: '', district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: '' },
        rating: 5,
        comment: '',
        author: ''
    });
    // Multi-criteria filtering block
    const filteredReviews = reviews.filter((item) => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMainCategory = selectedMainCategory === 'all' || item.mainCategory === selectedMainCategory;
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSubCategory = selectedSubCategory === 'all' || item.subCategory === selectedSubCategory;
        const matchesCity = selectedCityFilter === 'all' || (item.location && item.location.city === selectedCityFilter);
        const matchesDistrict = selectedDistrictFilter === 'all' || (item.location && item.location.district === selectedDistrictFilter);
        const matchesZone = selectedZoneFilter === 'all' || (item.location && item.location.zone === selectedZoneFilter);
        const matchesSubDistrict = selectedSubDistrictFilter === 'all' || (item.location && item.location.subDistrict === selectedSubDistrictFilter);
        const matchesStreet = selectedStreetFilter === 'all' || (item.location && item.location.street === selectedStreetFilter);
        const matchesAlley = selectedAlleyFilter === 'all' || (item.location && item.location.alley === selectedAlleyFilter);
        const matchesSpecificArea = selectedSpecificAreaFilter === '' || (item.location && item.location.specificArea && item.location.specificArea.toLowerCase().includes(selectedSpecificAreaFilter.toLowerCase()));

        return matchesSearch && matchesMainCategory && matchesCategory && matchesSubCategory && matchesCity && matchesDistrict && matchesZone && matchesSubDistrict && matchesStreet && matchesAlley && matchesSpecificArea;
    });

    const currentSelectedMainCategory = categories.find(cat => cat.value === selectedMainCategory);
    const categoriesForFilter = currentSelectedMainCategory?.platforms || currentSelectedMainCategory?.subcategories || [];
    const currentSelectedCategoryFilterObj = categoriesForFilter.find(cat => cat.value === selectedCategory);
    const subcategoriesForFilter = currentSelectedCategoryFilterObj?.subcategories || [];
    const currentSelectedCityFilterObj = citiesData.find(city => city.value === selectedCityFilter);
    const districtsForFilter = currentSelectedCityFilterObj?.districts || [];
    const currentSelectedDistrictFilterObj = districtsForFilter.find(d => d.value === selectedDistrictFilter);
    const zonesForFilter = currentSelectedDistrictFilterObj?.zones || [];
    const currentSelectedZoneFilterObj = zonesForFilter.find(z => z.value === selectedZoneFilter);
    const subDistrictsForFilter = currentSelectedZoneFilterObj 
        ? (currentSelectedDistrictFilterObj?.subDistricts.filter(sd => currentSelectedZoneFilterObj.khwaengValues.includes(sd.value)) || [])
        : (currentSelectedDistrictFilterObj?.subDistricts || []);

    const getStreetsForFilter = useCallback(() => {
        if (selectedCityFilter !== 'Bangkok') return [];
    
        let relevantKhwaengs = [];
    
        if (selectedSubDistrictFilter !== 'all') {
            relevantKhwaengs.push(selectedSubDistrictFilter);
        } else if (selectedZoneFilter !== 'all' && currentSelectedZoneFilterObj) {
            relevantKhwaengs = currentSelectedZoneFilterObj.khwaengValues;
        } else if (selectedDistrictFilter !== 'all' && currentSelectedDistrictFilterObj) {
            relevantKhwaengs = currentSelectedDistrictFilterObj.subDistricts.map(sd => sd.value);
        } else if (selectedDistrictFilter === 'all') {
            return bangkokStreetsData; // No district selected, show all streets for Bangkok
        }
    
        if (relevantKhwaengs.length === 0) return [];
    
        return bangkokStreetsData.filter(street =>
            street.associatedKhwaengs && street.associatedKhwaengs.some(khwaeng => relevantKhwaengs.includes(khwaeng))
        );
    }, [selectedCityFilter, selectedDistrictFilter, selectedZoneFilter, selectedSubDistrictFilter, currentSelectedDistrictFilterObj, currentSelectedZoneFilterObj, bangkokStreetsData]);

    const streetsForFilter = getStreetsForFilter();
    const currentSelectedStreetFilterObj = streetsForFilter.find(s => s.value === selectedStreetFilter);
    const alleysForFilter = currentSelectedStreetFilterObj?.alleys || [];

    // Auth and data effects remain the same
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAuthReady) {
            setReviews(initialSampleReviews);
        }
    }, [isAuthReady]);

    // Update newReview author when user logs in
    useEffect(() => {
        if (user) {
            setNewReview(prev => ({ ...prev, author: user.displayName || '' }));
        }
    }, [user]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setPage('detail');
    };

    const handleBack = () => {
        setSelectedItem(null);
        setPage('home');
    };
      
    const handleLogin = async () => {
        try {
            const { user: loggedInUser } = await signInWithGoogle();
            setUser(loggedInUser);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setPage('home'); // Go to home page on logout
    };
    
    const handleSubmitReview = (newReviewData) => {
        if (!user) {
            console.log(language === 'en' ? 'You must be logged in to submit a review.' : 'คุณต้องเข้าสู่ระบบเพื่อส่งรีวิว');
            alert(language === 'en' ? 'Please sign in to write a review.' : 'กรุณาเข้าสู่ระบบเพื่อเขียนรีวิว');
            return;
        }
        if (!newReviewData.itemName.trim() || !newReviewData.mainCategory || !newReviewData.category || !newReviewData.comment.trim() || !newReviewData.author.trim()) {
            console.log(language === 'en' ? 'Please fill in all required fields (Item Name, Main Category, Category, Your Review, Your Name).' : 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมด (ชื่อรายการ, หมวดหมู่หลัก, หมวดหมู่, รีวิวของคุณ, ชื่อของคุณ)');
            return;
        }

        const reviewToAdd = {
            id: Date.now(),
            author: newReviewData.author.trim(),
            rating: newReviewData.rating,
            date: new Date().toISOString().split('T')[0],
            comment: newReviewData.comment.trim(),
            comment_th: newReviewData.comment_th ? newReviewData.comment_th.trim() : '',
            verified: true, // Mark as verified since user is logged in
            helpful: 0,
            authorId: user.uid, // Add author's ID
            authorPhotoURL: user.photoURL // Add author's photo
        };

        const existingItemIndex = reviews.findIndex(item => 
            item.itemName.toLowerCase() === newReviewData.itemName.toLowerCase().trim() &&
            item.mainCategory === newReviewData.mainCategory &&
            item.category === newReviewData.category &&
            item.subCategory === newReviewData.subCategory
        );

        let updatedReviews = [...reviews];
        let updatedItem;

        if (existingItemIndex > -1) {
            const itemToUpdate = { ...updatedReviews[existingItemIndex] };
            const newReviewCount = itemToUpdate.reviewCount + 1;
            const oldTotalRating = itemToUpdate.rating * itemToUpdate.reviewCount;
            itemToUpdate.rating = (oldTotalRating + newReviewData.rating) / newReviewCount;
            itemToUpdate.reviewCount = newReviewCount;
            itemToUpdate.reviews = [reviewToAdd, ...itemToUpdate.reviews];
            updatedReviews[existingItemIndex] = itemToUpdate;
            updatedItem = itemToUpdate;
            console.log(language === 'en' ? 'Review added to existing item!' : 'เพิ่มรีวิวในรายการที่มีอยู่แล้ว!');
        } else {
            const newItem = {
                id: `new-item-${Date.now()}`,
                itemName: newReviewData.itemName.trim(),
                mainCategory: newReviewData.mainCategory,
                category: newReviewData.category,
                subCategory: newReviewData.subCategory,
                location: newReviewData.location,
                rating: newReviewData.rating,
                reviewCount: 1,
                reviews: [reviewToAdd]
            };
            updatedReviews = [newItem, ...updatedReviews];
            updatedItem = newItem;
            console.log(language === 'en' ? 'New item and review submitted!' : 'ส่งรายการใหม่และรีวิวแล้ว!');
        }
        
        setReviews(updatedReviews);
        setShowReviewForm(false);
        setNewReview({
            itemName: '', mainCategory: '', category: '', subCategory: '', 
            location: { city: '', district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: '' },
            rating: 5, comment: '', author: user.displayName || ''
        });
        
        if (page === 'detail') {
            setSelectedItem(updatedItem);
        }
    };

    useEffect(() => {
        if (filteredReviews.length === 0 && isAuthReady && page === 'home') {
            setIsLoadingNoMatchingReviewsMessage(true);
            setTimeout(() => {
                const message = language === 'en' 
                    ? `No reviews match your filters. Be the first to add one!`
                    : `ไม่พบรีวิวที่ตรงกับเกณฑ์ของคุณ เป็นคนแรกที่เพิ่มรีวิว!`;
                setNoMatchingReviewsMessage(message);
                setIsLoadingNoMatchingReviewsMessage(false);
            }, 300);
        }
    }, [filteredReviews.length, isAuthReady, language, page]);

    if (page === 'detail') {
        return (
            <ItemDetailPage 
                item={selectedItem}
                onBack={handleBack}
                language={language}
                categories={categories}
                citiesData={citiesData}
                bangkokStreetsData={bangkokStreetsData}
                generatedImages={generatedImages}
                setGeneratedImages={setGeneratedImages}
            />
        );
    }
    
 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-sans antialiased pt-12">
    {/* Enhanced Header */}
    <Header
      showHeader={showHeader}
      toggleSearchBar={toggleSearchBar}
      toggleFilters={toggleFilters}
      user={user}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      setShowReviewForm={setShowReviewForm}
      language={language}
      setLanguage={setLanguage}
      GoogleIcon={GoogleIcon}
    />

      {showSearchBar && (
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search...' : 'ค้นหา...'}
              className="w-full pl-8 pr-3 py-2 rounded-md bg-gray-800 placeholder-gray-500 text-sm focus:outline-none"
            />
          </div>
        </div>
      )}

      {showFilters && (
        <div className="px-4 py-2">
          <select
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            className="bg-gray-800 text-sm rounded-md p-2"
          >
            {categories.filter(c => c.isTopLevel).map(cat => (
              <option key={cat.value} value={cat.value}>
                {language === 'en' ? cat.label : cat.label_th}
              </option>
            ))}
          </select>
        </div>
      )}

    {/* Main Content */}
    <ItemList
      filteredReviews={filteredReviews}
      isAuthReady={isAuthReady}
      handleItemClick={handleItemClick}
      language={language}
      categories={categories}
      citiesData={citiesData}
      bangkokStreetsData={bangkokStreetsData}
      generatedImages={generatedImages}
      setGeneratedImages={setGeneratedImages}
      isLoadingNoMatchingReviewsMessage={isLoadingNoMatchingReviewsMessage}
      noMatchingReviewsMessage={noMatchingReviewsMessage}
      generateImage={generateImage}
    />

    {/* Modal */}
    {showReviewForm && (
      <ReviewFormModal
        show={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        newReview={newReview}
        setNewReview={setNewReview}
        onSubmit={handleSubmitReview}
        categories={categories}
        citiesData={citiesData}
        bangkokStreetsData={bangkokStreetsData}
        language={language}
      />
    )}
  </div>
);

};

export default App;
