import React from "react";
import { X, Camera } from "lucide-react";
import StarRating from "./StarRating";
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

    const inputClasses =
        "w-full px-3 py-2 bg-gray-800/60 border border-gray-600 rounded-md text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition";

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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-2xl shadow-black/80 max-w-lg w-full p-6 text-gray-100 max-h-[90vh] overflow-y-auto border border-gray-700/50 scrollbar-hide">
                <div className="flex justify-between items-center mb-4">
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
                
                <div className="space-y-4">
                    <div className="space-y-3 p-3 bg-gray-800/20 rounded-xl border border-gray-700/50">
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
                    </div>

                    {showLocationFields && (
                <div className="space-y-3 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
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
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Rating" : "คะแนน"}
                        </label>
                    <div className="flex justify-center p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
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
                    
                    <div className="flex gap-3 pt-3">
                        <button
                            onClick={() => console.log(language === 'en' ? 'Photo upload functionality would be implemented here.' : 'ฟังก์ชันอัปโหลดรูปภาพจะถูกนำมาใช้ที่นี่')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg border-gray-600 text-gray-300 hover:bg-gray-800/40 hover:text-gray-100 transition"
                        >
                            <Camera size={20} />
                            {language === 'en' ? "Add Photos" : "เพิ่มรูปภาพ"}
                        </button>
                        <button
                            onClick={() => onSubmit(newReview)}
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-purple-500 hover:to-blue-500 transition"
                        >
                            {language === 'en' ? "Submit Review" : "ส่งรีวิว"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReviewFormModal;
