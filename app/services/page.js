"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ServicesPage() {
    // === الحالات (States) ===
    const [allServices, setAllServices] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeIndustry, setActiveIndustry] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // حالات واجهة الجزيرة (Filter Island)
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState(null); // 'cat' or 'ind'
    const [isSearchMode, setIsSearchMode] = useState(false);

    // حالة مودال الصور
    const [modal, setModal] = useState({ isOpen: false, src: '', title: '' });

    // متغيرات التقسيم
    const gridItemsPerPage = 24; 
    const sliderRowsPerPage = 4; 

    // محاكاة جلب البيانات من قاعدة البيانات (لحين ربط الـ API لاحقاً)
    useEffect(() => {
        const dummyData = [
            { id: 1, cat: 'branding', ind: 'restaurants', name: 'هوية مطعم برجريتو', desc: 'تصميم شعار عصري مع قائمة طعام ومطبوعات تغليف للمطعم.', img: 'brand_identity.webp', price: '5000' },
            { id: 2, cat: 'packaging', ind: 'supermarket', name: 'تغليف منتجات ألبان', desc: 'تصميم استيكر وعبوات لمنتجات غذائية بألوان جذابة.', img: 'packaging_sleeve.webp', price: '3500' },
            { id: 3, cat: 'digital', ind: 'medical', name: 'حملة تسويق عيادة', desc: 'تصميم بوستات سوشيال ميديا مع إدارة إعلانات جوجل.', img: 'instagram_posts.webp', price: '4000' },
            { id: 4, cat: 'branding', ind: 'realestate', name: 'شعار شركة عقارات', desc: 'شعار احترافي يعكس الثقة والفخامة للشركات العقارية.', img: 'logo_design.webp', price: '2500' },
            { id: 5, cat: 'digital', ind: 'restaurants', name: 'منيو إلكتروني ذكي', desc: 'برمجة وتصميم منيو تفاعلي بالباركود للمطاعم والكافيهات.', img: 'digital_menu.webp', price: '1500' },
            { id: 6, cat: 'packaging', ind: 'beauty', name: 'علب مستحضرات تجميل', desc: 'تغليف فاخر لمنتجات العناية بالبشرة.', img: 'product_box.webp', price: '4500' },
            { id: 7, cat: 'branding', ind: 'education', name: 'هوية مركز تدريب', desc: 'هوية متكاملة شاملة الكارنيهات والشهادات.', img: 'business_cards.webp', price: '3000' }
        ];
        setAllServices(dummyData);
    }, []);

    // === الوظائف المساعدة ===
    const truncateWords = (str, num) => {
        if (!str) return '';
        const words = str.split(/\s+/);
        if (words.length <= num) return str;
        return words.slice(0, num).join(' ') + '...';
    };

    const getIndName = (ind) => {
        if (!ind || ind === 'general') return 'عام';
        const names = {
            'restaurants': 'مطاعم وكافيهات', 'realestate': 'عقارات ومقاولات', 'medical': 'مجال طبي وعيادات',
            'supermarket': 'سوبر ماركت', 'education': 'تعليم وتدريب', 'beauty': 'جمال وموضة',
            'corporate': 'شركات وناشئة', 'sports': 'رياضة ولياقة', 'industrial': 'صناعة ولوجستيك', 'travel': 'سياحة وسفر'
        };
        return names[ind] || ind;
    };

    const scrollSlider = (id, direction) => {
        const slider = document.getElementById(id);
        if (slider) {
            const scrollAmount = slider.clientWidth * 0.8; 
            slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' }); 
        }
    };

    // === وظائف الفلترة والبحث ===
    const toggleFilterSection = (section) => {
        if (isExpanded && activeSection === section) {
            setIsExpanded(false);
            setActiveSection(null);
        } else {
            setIsExpanded(true);
            setActiveSection(section);
        }
    };

    const closeIsland = () => {
        setIsExpanded(false);
        setTimeout(() => setActiveSection(null), 300);
    };

    const openSearchMode = () => {
        if (isExpanded) closeIsland();
        setIsSearchMode(true);
    };

    const closeSearchMode = () => {
        setIsSearchMode(false);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const applyFilter = (type, value) => {
        if (type === 'cat') setActiveCategory(value);
        if (type === 'ind') setActiveIndustry(value);
        setCurrentPage(1);
        closeIsland();
        
        // التمرير الناعم للأسفل قليلاً بعد الفلترة
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    // إغلاق الجزيرة عند النقر خارجها
    const islandRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (islandRef.current && !islandRef.current.contains(e.target) && isExpanded) {
                closeIsland();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded]);


    // === معالجة البيانات للعرض ===
    const isDefaultView = (activeCategory === 'all' && activeIndustry === 'all' && searchQuery === '');

    const filteredServices = allServices.filter(s => {
        const matchesCategory = activeCategory === 'all' || s.cat === activeCategory;
        const matchesIndustry = activeIndustry === 'all' || (s.ind && s.ind.includes(activeIndustry));
        const serviceName = s.name ? s.name.toLowerCase() : '';
        const serviceDesc = s.desc ? s.desc.toLowerCase() : '';
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' || serviceName.includes(lowerQuery) || serviceDesc.includes(lowerQuery);
        return matchesCategory && matchesIndustry && matchesSearch;
    });

    let hasMore = false;
    let renderContent = null;
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    const titleLimit = isMobile ? 2 : 3;
    const descLimit  = isMobile ? 3 : 5;

    // 1. عرض السلايدر (الوضع الافتراضي)
    if (isDefaultView) {
        const grouped = {};
        filteredServices.forEach(s => {
            const ind = s.ind || 'general';
            if (!grouped[ind]) grouped[ind] = [];
            grouped[ind].push(s);
        });

        let rows = [];
        for (let ind in grouped) {
            rows.push({
                title: getIndName(ind),
                indKey: ind,
                items: grouped[ind].slice(0, 6),
                showViewMore: grouped[ind].length > 6
            });
        }

        const endIndex = currentPage * sliderRowsPerPage;
        const paginatedRows = rows.slice(0, endIndex);
        hasMore = endIndex < rows.length;

        renderContent = (
            <div className="mt-[90px] md:mt-[114px] flex flex-col gap-10 md:gap-16">
                {paginatedRows.map((row, rowIndex) => {
                    const uniqueId = `slider-${currentPage}-${rowIndex}`;
                    return (
                        <div key={rowIndex} className="relative group flex flex-col w-full">
                            <h2 className="text-center font-black text-xl md:text-3xl text-[#44403c] mb-5 md:mb-8">{row.title}</h2>
                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-[10px] md:gap-4 hide-scrollbar scroll-smooth pb-4" id={uniqueId}>
                                
                                {row.items.map(s => (
                                    <Link key={s.id} href={`/service-details?id=${s.id}`} className="slider-card snap-start shrink-0 p-3 md:p-4 rounded-2xl flex flex-col group relative bg-white" style={{ textDecoration: 'none' }}>
                                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 relative mb-3 md:mb-4">
                                            <img src={`/products/${s.img}`} alt={s.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded-lg shadow-sm hidden md:flex hover:bg-white z-20 items-center justify-center cursor-zoom-in" 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModal({ isOpen: true, src: `/products/${s.img}`, title: s.name }); }}>
                                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-grow text-right">
                                            <span className="text-[9px] md:text-[10px] font-black uppercase text-stone-500 mb-1.5 md:mb-2 block tracking-wider">{getIndName(s.ind)}</span>
                                            <h3 className="font-black text-sm md:text-base text-[#44403c] mb-1 leading-snug" title={s.name}>{truncateWords(s.name, titleLimit)}</h3>
                                            <p className="text-[10px] md:text-xs text-stone-500 mb-3 md:mb-4 font-bold h-[2.5em] overflow-hidden leading-relaxed">{truncateWords(s.desc, descLimit)}</p>
                                            <div className="mt-auto">
                                                <span className="text-sm md:text-lg font-black text-[#c2410c] block">{s.price} ج.م</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {row.showViewMore && (
                                    <div onClick={() => applyFilter('ind', row.indKey)} className="slider-card snap-start shrink-0 p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center group relative bg-stone-50 border-2 border-dashed border-stone-300 hover:border-[#c2410c] hover:bg-[#fff7ed] cursor-pointer transition-all min-h-[220px]">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-3 group-hover:bg-[#c2410c] group-hover:text-white transition-all shadow-sm">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                        </div>
                                        <span className="font-black text-sm md:text-base text-stone-600 group-hover:text-[#c2410c]">عرض المزيد</span>
                                        <span className="text-[10px] md:text-xs text-stone-400 mt-1 text-center font-bold">في {row.title}</span>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => scrollSlider(uniqueId, 1)} className="absolute top-1/2 right-0 translate-x-1/2 bg-white border border-stone-200 shadow-xl rounded-full p-3 hidden md:flex z-10 hover:text-[#c2410c] hover:scale-110 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                            <button onClick={() => scrollSlider(uniqueId, -1)} className="absolute top-1/2 left-0 -translate-x-1/2 bg-white border border-stone-200 shadow-xl rounded-full p-3 hidden md:flex z-10 hover:text-[#c2410c] hover:scale-110 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    } 
    // 2. عرض الشبكة (وضع الفلتر والبحث)
    else {
        const endIndex = currentPage * gridItemsPerPage;
        const paginatedItems = filteredServices.slice(0, endIndex);
        hasMore = endIndex < filteredServices.length;

        renderContent = (
            <div className="mt-[90px] md:mt-[114px] grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5">
                {paginatedItems.map(s => (
                    <Link key={s.id} href={`/service-details?id=${s.id}`} className="grid-card p-3 md:p-4 rounded-2xl flex flex-col group relative bg-white" style={{ textDecoration: 'none' }}>
                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 relative mb-3 md:mb-4">
                            <img src={`/products/${s.img}`} alt={s.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded-lg shadow-sm hidden md:flex hover:bg-white z-20 items-center justify-center cursor-zoom-in" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setModal({ isOpen: true, src: `/products/${s.img}`, title: s.name }); }}>
                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                            </div>
                        </div>
                        <div className="flex flex-col flex-grow text-right">
                            <span className="text-[9px] md:text-[10px] font-black uppercase text-stone-500 mb-1.5 md:mb-2 block tracking-wider">{getIndName(s.ind)}</span>
                            <h3 className="font-black text-sm md:text-base text-[#44403c] mb-1 leading-snug" title={s.name}>{truncateWords(s.name, titleLimit)}</h3>
                            <p className="text-[10px] md:text-xs text-stone-500 mb-3 md:mb-4 font-bold h-[2.5em] overflow-hidden leading-relaxed">{truncateWords(s.desc, descLimit)}</p>
                            <div className="mt-auto">
                                <span className="text-sm md:text-lg font-black text-[#c2410c] block">{s.price} ج.م</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <main className="pb-20 px-4 md:px-6 text-right relative overflow-hidden pt-24">
            <div className="max-w-7xl mx-auto relative">
                
                {/* الجزيرة العائمة */}
                <div className="sticky-filter-wrapper">
                    <div id="filterIsland" ref={islandRef} className={`filter-island ${isExpanded ? 'expanded' : ''} ${isSearchMode ? 'search-active' : ''}`}>
                        <div className="island-header">
                            <div className="island-default-ui">
                                <button onClick={() => toggleFilterSection('cat')} className={`island-btn ${activeCategory !== 'all' ? 'active-filter' : ''}`}>
                                    <span className="truncate">
                                        {activeCategory === 'all' ? 'نوع الخدمة' : 
                                         activeCategory === 'branding' ? 'هوية بصرية ✖' : 
                                         activeCategory === 'packaging' ? 'تغليف ✖' : 'دعاية رقمية ✖'}
                                    </span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" style={{ transform: activeSection === 'cat' ? 'rotate(180deg)' : 'rotate(0)' }}><path d="M6 9l6 6 6-6"/></svg>
                                </button>
                                <div className="island-divider"></div>
                                <button onClick={openSearchMode} className="island-btn" style={{ flex: 0.35, color: 'var(--primary-brick)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                </button>
                                <div className="island-divider"></div>
                                <button onClick={() => toggleFilterSection('ind')} className={`island-btn ${activeIndustry !== 'all' ? 'active-filter' : ''}`}>
                                    <span className="truncate">{activeIndustry === 'all' ? 'التخصص' : getIndName(activeIndustry) + ' ✖'}</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" style={{ transform: activeSection === 'ind' ? 'rotate(180deg)' : 'rotate(0)' }}><path d="M6 9l6 6 6-6"/></svg>
                                </button>
                            </div>

                            <div className="island-search-ui">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input type="text" placeholder="ابحث عن الخدمة التي تريدها..." value={searchQuery} onChange={handleSearch} />
                                <button onClick={closeSearchMode} className="text-stone-400 hover:text-[#c2410c] transition-colors p-2 rounded-full bg-stone-100 hover:bg-[#fff7ed]">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* محتوى تصنيف الخدمة */}
                        <div className={`island-content ${activeSection === 'cat' ? 'active' : ''}`}>
                            <hr className="border-stone-100 mb-2" />
                            <div className="max-h-[250px] overflow-y-auto pr-1 hide-scrollbar">
                                <div className={`island-item ${activeCategory === 'all' ? 'selected' : ''}`} onClick={() => applyFilter('cat', 'all')}>كل الخدمات</div>
                                <div className={`island-item ${activeCategory === 'branding' ? 'selected' : ''}`} onClick={() => applyFilter('cat', 'branding')}>الهوية البصرية</div>
                                <div className={`island-item ${activeCategory === 'packaging' ? 'selected' : ''}`} onClick={() => applyFilter('cat', 'packaging')}>تغليف المنتجات</div>
                                <div className={`island-item ${activeCategory === 'digital' ? 'selected' : ''}`} onClick={() => applyFilter('cat', 'digital')}>الدعاية الرقمية</div>
                            </div>
                        </div>

                        {/* محتوى تصنيف التخصص */}
                        <div className={`island-content ${activeSection === 'ind' ? 'active' : ''}`}>
                            <hr className="border-stone-100 mb-2" />
                            <div className="max-h-[250px] overflow-y-auto pr-1 hide-scrollbar">
                                <div className={`island-item ${activeIndustry === 'all' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'all')}>كل التخصصات</div>
                                <div className={`island-item ${activeIndustry === 'restaurants' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'restaurants')}>مطاعم وكافيهات</div>
                                <div className={`island-item ${activeIndustry === 'realestate' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'realestate')}>عقارات ومقاولات</div>
                                <div className={`island-item ${activeIndustry === 'medical' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'medical')}>مجال طبي وعيادات</div>
                                <div className={`island-item ${activeIndustry === 'supermarket' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'supermarket')}>سوبر ماركت</div>
                                <div className={`island-item ${activeIndustry === 'education' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'education')}>تعليم وتدريب</div>
                                <div className={`island-item ${activeIndustry === 'beauty' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'beauty')}>جمال وموضة</div>
                                <div className={`island-item ${activeIndustry === 'corporate' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'corporate')}>شركات وناشئة</div>
                                <div className={`island-item ${activeIndustry === 'sports' ? 'selected' : ''}`} onClick={() => applyFilter('ind', 'sports')}>رياضة ولياقة</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* محتوى الخدمات */}
                {filteredServices.length === 0 ? (
                    <div className="mt-[90px] md:mt-[114px] py-40 text-center font-bold text-stone-400 w-full">لا توجد خدمات تطابق اختياراتك حالياً.</div>
                ) : (
                    <>
                        {renderContent}
                        {hasMore && (
                            <div className={`flex justify-center mt-6 w-full ${!isDefaultView ? 'col-span-full' : ''}`}>
                                <button onClick={() => setCurrentPage(prev => prev + 1)} className="bg-white border-2 border-stone-200 text-stone-600 font-black py-3 px-10 rounded-[1.5rem] hover:border-[#c2410c] hover:text-[#c2410c] transition-all shadow-sm active:scale-95 flex items-center gap-2">
                                    عرض المزيد
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* مودال عرض الصورة الكبيرة */}
            <div className={`fixed inset-0 bg-stone-50/95 backdrop-blur-md flex-col items-center justify-center p-4 z-[2500] ${modal.isOpen ? 'flex' : 'hidden'}`}>
                <div className="absolute inset-0 cursor-zoom-out" onClick={() => setModal({ ...modal, isOpen: false })}></div>
                <button onClick={() => setModal({ ...modal, isOpen: false })} className="absolute top-8 right-8 text-stone-800 bg-stone-200 p-3 rounded-full hover:bg-[#c2410c] hover:text-white transition-all z-[2510]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <img src={modal.src} className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl relative z-[2505] object-contain border border-stone-200" alt={modal.title} />
                <p className="text-stone-800 font-black mt-8 relative z-[2505] bg-white/80 px-8 py-3 rounded-full border border-stone-200 uppercase tracking-widest text-sm shadow-sm">{modal.title}</p>
            </div>
        </main>
    );
}