import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ka' | 'en';
  setLanguage: (lang: 'ka' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  ka: {
    // Header
    'header.men': 'მამაკაცები',
    'header.women': 'ქალები',
    'header.sale': 'ფასდაკლება',
    'header.shopping_bag': 'საყიდლების ჩანთა',
    'header.continue_shopping': 'შოპინგის გაგრძელება',
    'header.your_bag_empty': 'თქვენი ჩანთა ცარიელია',
    'header.add_items': 'დაამატეთ ნივთები დასაწყებად.',
    'header.checkout': 'გადახდა',
    'header.each': 'თითოეული',

    // Home page
    'home.hero_title': 'MAISON NIKOLAS',
    'home.hero_subtitle': 'უვადო ელეგანტურობა 2025 წლიდან',
    'home.shop_now': 'იყიდე ახლა',
    'home.featured': 'რჩეული',
    'home.featured_subtitle': 'სეზონისთვის შერჩეული ნაწარმი',
    'home.new_arrivals': 'ახალი მოსვლები',
    'home.new_arrivals_subtitle': 'ჩვენი კოლექციის უახლესი დამატებები',
    'home.stay_in_touch': 'დარჩით კავშირში',
    'home.newsletter_subtitle': 'პირველები იყავით ინფორმირებული ახალი კოლექციებისა და ექსკლუზიური შეთავაზებების შესახებ',
    'home.customer_care': 'მომხმარებელთა მომსახურება',
    'home.size_guide': 'ზომების სახელმძღვანელო',
    'home.shipping_returns': 'მიწოდება და დაბრუნება',
    'home.care_instructions': 'მოვლის ინструქციები',
    'home.contact_us': 'დაგვიკავშირდით',
    'home.company': 'კომპანია',
    'home.about_us': 'ჩვენ შესახებ',
    'home.careers': 'კარიერა',
    'home.press': 'პრესა',
    'home.sustainability': 'მდგრადობა',
    'home.footer_text': '2025 წლიდან, ჩვენ ვქმნით უვადო ნაწარმს, რომელიც განასახიერებს ელეგანტურობასა და დახვეწილობას თანამედროვე გარდერობისთვის.',
    'home.rights_reserved': '© 2025 Maison Nikolas. ყველა უფლება დაცულია.',

    // Newsletter
    'newsletter.enter_email': 'შეიყვანეთ თქვენი ელ-ფოსტა',
    'newsletter.subscribe': 'გამოწერა',
    'newsletter.subscribing': 'გამოწერა...',
    'newsletter.success': 'წარმატებით გამოიწერეთ ჩვენი სიახლეები!',
    'newsletter.already_subscribed': 'ეს ელ-ფოსტა უკვე გამოწერილია ჩვენს სიახლეებზე.',
    'newsletter.error': 'გამოწერა ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა.',

    // Product
    'product.add_to_cart': 'კალათაში დამატება',
    'product.buy': 'ყიდვა',
    'product.color': 'ფერი',
    'product.size': 'ზომა',
    'product.quantity': 'რაოდენობა',
    'product.available': 'ხელმისაწვდომია',
    'product.out_of_stock': 'არ არის მარაგში',
    'product.add_to_bag': 'ჩანთაში დამატება',
    'product.free_shipping': 'უფასო მიწოდება',
    'product.free_shipping_desc': 'შეკვეთებზე 100 ლარზე მეტი',
    'product.warranty': '2 წლის გარანტია',
    'product.warranty_desc': 'ხარისხის გარანტია',
    'product.easy_returns': 'მარტივი დაბრუნება',
    'product.easy_returns_desc': '30 დღიანი დაბრუნების პოლიტიკა',
    'product.customer_reviews': 'მომხმარებელთა მიმოხილვები',
    'product.reviews': 'მიმოხილვები',
    'product.review': 'მიმოხილვა',

    // Cart
    'cart.shopping_cart': 'საყიდლების კალათა',
    'cart.clear_cart': 'კალათის გასუფთავება',
    'cart.back_to_collection': 'კოლექციაში დაბრუნება',
    'cart.order_summary': 'შეკვეთის შეჯამება',
    'cart.subtotal': 'ქვეჯამი',
    'cart.shipping': 'მიწოდება',
    'cart.free': 'უფასო',
    'cart.tax': 'გადასახადი',
    'cart.calculated_at_checkout': 'გადახდისას გამოითვლება',
    'cart.total': 'სულ',
    'cart.proceed_to_checkout': 'გადახდაზე გადასვლა',
    'cart.continue_shopping': 'შოპინგის გაგრძელება',
    'cart.secure_checkout': 'უსაფრთხო გადახდა',
    'cart.free_shipping_over': 'უფასო მიწოდება 100 ლარზე მეტ შეკვეთებზე',
    'cart.return_policy': '30-დღიანი დაბრუნების პოლიტიკა',
    'cart.empty_title': 'თქვენი კალათა ცარიელია',
    'cart.empty_subtitle': 'აღმოაჩინეთ ჩვენი ლუქს კოლექცია და დაამატეთ ნივთები კალათაში.',

    // Checkout
    'checkout.title': 'გადახდა',
    'checkout.back_to_cart': 'კალათაში დაბრუნება',
    'checkout.shipping_info': 'მიწოდების ინფორმაცია',
    'checkout.first_name': 'სახელი',
    'checkout.last_name': 'გვარი',
    'checkout.phone': 'ტელეფონის ნომერი',
    'checkout.city': 'ქალაქი',
    'checkout.address': 'მისამართი',
    'checkout.payment_method': 'გადახდის მეთოდი',
    'checkout.tbc_bank': 'TBC ბანკი',
    'checkout.bog_bank': 'საქართველოს ბანკი',
    'checkout.place_order': 'შეკვეთის გაფორმება',
    'checkout.processing': 'მუშავდება...',
    'checkout.cart_empty': 'თქვენი კალათა ცარიელია',
    'checkout.enter_first_name': 'შეიყვანეთ თქვენი სახელი',
    'checkout.enter_last_name': 'შეიყვანეთ თქვენი გვარი',
    'checkout.enter_phone': 'შეიყვანეთ ტელეფონის ნომერი',
    'checkout.enter_city': 'შეიყვანეთ თქვენი ქალაქი',
    'checkout.enter_address': 'შეიყვანეთ სრული მისამართი',
    'checkout.ssl_protected': 'SSL-ით დაცული უსაფრთხო გადახდა',
    'checkout.multiple_payment': 'მრავალი გადახდის ვარიანტი ხელმისაწვდომია',

    // Categories
    'category.men_collection': 'მამაკაცების კოლექცია',
    'category.men_subtitle': 'უვადო ელეგანტურობა თანამედროვე ჯენტლმენისთვის',
    'category.men_description': 'აღმოაჩინეთ ჩვენი შერჩეული პრემიუმ მამაკაცური ტანსაცმლის კოლექცია, დამზადებული საუკეთესო მასალებისგან და დეტალებზე ყურადღებით. კლასიკური პერანგებიდან მორგებულ კოსტუმებამდე, თითოეული ნაწარმი განასახიერებს დახვეწილობასა და სტილს.',
    'category.women_collection': 'ქალების კოლექცია',
    'category.women_subtitle': 'დახვეწილი სტილი თანამედროვე ქალისთვის',
    'category.women_description': 'გამოიკვლიეთ ჩვენი განსაკუთრებული ქალების კოლექცია, რომელიც მოიცავს ელეგანტურ კაბებს, ლუქს ბლუზებსა და უვადო ნაწარმს, რომლებიც აღნიშნავს ქალურობასა და მადლს. თითოეული ტანსაცმელი შექმნილია გაძლიერებისა და შთაგონებისთვის.',
    'category.men_categories': 'მამაკაცების კატეგორიები',
    'category.women_categories': 'ქალების კატეგორიები',
    'category.discover_men': 'აღმოაჩინეთ ჩვენი პრემიუმ მამაკაცების კოლექცია სხვადასხვა კატეგორიებში',
    'category.explore_women': 'გამოიკვლიეთ ჩვენი ელეგანტური ქალების კოლექცია სხვადასხვა კატეგორიებში',
    'category.new_arrivals': 'ახალი მოსვლები',
    'category.new_arrivals_subtitle': 'უახლესი Maison Nikolas-დან',
    'category.new_arrivals_description': 'პირველები იყავით, ვინც აღმოაჩენს ჩვენს უახლეს ნაწარმს. ახალი დიზაინები, რომლებიც განასახიერებს ჩვენს ერთგულებას უვადო ელეგანტურობისა და თანამედროვე დახვეწილობისადმი.',
    'category.sale': 'ფასდაკლება',
    'category.sale_subtitle': 'განსაკუთრებული ღირებულება პრემიუმ ნაწარმზე',
    'category.sale_description': 'აღმოაჩინეთ ჩვენი ყურადღებით შერჩეული ფასდაკლებული ნივთები, რომლებიც ინარჩუნებს იგივე განსაკუთრებულ ხარისხსა და უვადო სტილს სპეციალურ ფასებში. შეზღუდული დროის შეთავაზებები ლუქს ნაწარმზე ჩვენი პრემიუმ კოლექციებიდან.',
    'category.items': 'ნივთები',
    'category.no_products': 'პროდუქტები ვერ მოიძებნა',
    'category.adjust_filters': 'სცადეთ ფილტრების შეცვლა ან მოგვიანებით შეამოწმეთ ახალი მოსვლები.',
    'category.stay_updated': 'იყავით განახლებული',
    'category.newsletter_description': 'პირველები იყავით ინფორმირებული ახალი კოლექციებისა და ექსკლუზიური შეთავაზებების შესახებ',

    // Sale page
    'sale.title': 'ფასდაკლება',
    'sale.subtitle': 'შერჩეული ნივთები სპეციალურ ფასებში',
    'sale.description': 'აღმოაჩინეთ განსაკუთრებული ღირებულება ჩვენს პრემიუმ კოლექციაზე. ხარისხი და სტილი სპეციალურ ფასებში.',
    'sale.highest_discount': 'ყველაზე მაღალი ფასდაკლება',
    'sale.no_sale_items': 'ფასდაკლებული ნივთები არ არის ხელმისაწვდომი',
    'sale.check_back': 'მოგვიანებით შეამოწმეთ ახალი ფასდაკლებული ნივთები და სპეციალური შეთავაზებები.',

    // Common
    'common.home': 'მთავარი',
    'common.loading': 'იტვირთება...',
    'common.search': 'ძიება',
    'common.filter': 'ფილტრი',
    'common.sort': 'დალაგება',
    'common.newest_first': 'ახალი პირველი',
    'common.price_low_high': 'ფასი: დაბლიდან მაღლამდე',
    'common.price_high_low': 'ფასი: მაღლიდან დაბლამდე',
    'common.name_az': 'სახელი ა-ჰ',
    'common.all_categories': 'ყველა კატეგორია',
    'common.back_to_home': 'მთავარ გვერდზე დაბრუნება',
    'common.product_not_found': 'პროდუქტი ვერ მოიძებნა',
    'common.product_not_found_desc': 'პროდუქტი, რომელსაც ეძებთ, არ არსებობს.',
    'common.save': 'დაზოგვა',
    'common.required': 'სავალდებულო',

    // Product categories
    'categories.shirts': 'პერანგები',
    'categories.suits': 'კოსტუმები',
    'categories.casual': 'კაზუალური',
    'categories.dresses': 'კაბები',
    'categories.blouses': 'ბლუზები',
    'categories.skirts': 'ქვედაბოლოები',

    // Badges
    'badges.new': 'ახალი',
    'badges.limited': 'შეზღუდული',
    'badges.featured': 'რჩეული',
    'badges.off': 'ფასდაკლება',
    'badges.save': 'დაზოგეთ',

    // Order
    'order.confirmed': 'შეკვეთა დადასტურდა!',
    'order.thank_you': 'გმადლობთ შესყიდვისთვის',
    'order.order_number': 'შეკვეთის ნომერი',
    'order.customer_info': 'მომხმარებლის ინფორმაცია',
    'order.order_info': 'შეკვეთის ინფორმაცია',
    'order.order_date': 'შეკვეთის თარიღი',
    'order.payment': 'გადახდა',
    'order.status': 'სტატუსი',
    'order.items_ordered': 'შეკვეთილი ნივთები',
    'order.order_status': 'შეკვეთის სტატუსი',
    'order.order_placed': 'შეკვეთა გაფორმდა',
    'order.processing': 'მუშავდება',
    'order.delivered': 'მიწოდებული',
    'order.not_found': 'შეკვეთა ვერ მოიძებნა',
    'order.not_found_desc': 'შეკვეთა, რომელსაც ეძებთ, არ არსებობს ან წაშლილია.',
  },
  en: {
    // Header
    'header.men': 'MEN',
    'header.women': 'WOMEN',
    'header.sale': 'SALE',
    'header.shopping_bag': 'Shopping Bag',
    'header.continue_shopping': 'Continue Shopping',
    'header.your_bag_empty': 'Your bag is empty',
    'header.add_items': 'Add items to get started.',
    'header.checkout': 'Checkout',
    'header.each': 'each',

    // Home page
    'home.hero_title': 'MAISON NIKOLAS',
    'home.hero_subtitle': 'Timeless Elegance Since 2025',
    'home.shop_now': 'SHOP NOW',
    'home.featured': 'FEATURED',
    'home.featured_subtitle': 'Handpicked pieces for the season',
    'home.new_arrivals': 'NEW ARRIVALS',
    'home.new_arrivals_subtitle': 'The latest additions to our collection',
    'home.stay_in_touch': 'STAY IN TOUCH',
    'home.newsletter_subtitle': 'Be the first to know about new collections and exclusive offers',
    'home.customer_care': 'Customer Care',
    'home.size_guide': 'Size Guide',
    'home.shipping_returns': 'Shipping & Returns',
    'home.care_instructions': 'Care Instructions',
    'home.contact_us': 'Contact Us',
    'home.company': 'Company',
    'home.about_us': 'About Us',
    'home.careers': 'Careers',
    'home.press': 'Press',
    'home.sustainability': 'Sustainability',
    'home.footer_text': 'Since 2025, we have been creating timeless pieces that embody elegance and sophistication for the modern wardrobe.',
    'home.rights_reserved': '© 2025 Maison Nikolas. All rights reserved.',

    // Newsletter
    'newsletter.enter_email': 'Enter your email',
    'newsletter.subscribe': 'SUBSCRIBE',
    'newsletter.subscribing': 'SUBSCRIBING...',
    'newsletter.success': 'Successfully subscribed to our newsletter!',
    'newsletter.already_subscribed': 'This email is already subscribed to our newsletter.',
    'newsletter.error': 'Failed to subscribe. Please try again.',

    // Product
    'product.add_to_cart': 'ADD TO CART',
    'product.buy': 'BUY',
    'product.color': 'Color',
    'product.size': 'Size',
    'product.quantity': 'Quantity',
    'product.available': 'available',
    'product.out_of_stock': 'Out of Stock',
    'product.add_to_bag': 'Add to Bag',
    'product.free_shipping': 'Free Shipping',
    'product.free_shipping_desc': 'On orders over ₾100',
    'product.warranty': '2 Year Warranty',
    'product.warranty_desc': 'Quality guarantee',
    'product.easy_returns': 'Easy Returns',
    'product.easy_returns_desc': '30 day return policy',
    'product.customer_reviews': 'Customer Reviews',
    'product.reviews': 'reviews',
    'product.review': 'review',

    // Cart
    'cart.shopping_cart': 'Shopping Cart',
    'cart.clear_cart': 'Clear Cart',
    'cart.back_to_collection': 'Back to Collection',
    'cart.order_summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.tax': 'Tax',
    'cart.calculated_at_checkout': 'Calculated at checkout',
    'cart.total': 'Total',
    'cart.proceed_to_checkout': 'Proceed to Checkout',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.secure_checkout': 'Secure checkout',
    'cart.free_shipping_over': 'Free shipping on orders over ₾100',
    'cart.return_policy': '30-day return policy',
    'cart.empty_title': 'Your Cart is Empty',
    'cart.empty_subtitle': 'Discover our luxury collection and add items to your cart.',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.back_to_cart': 'Back to Cart',
    'checkout.shipping_info': 'Shipping Information',
    'checkout.first_name': 'First Name',
    'checkout.last_name': 'Last Name',
    'checkout.phone': 'Phone Number',
    'checkout.city': 'City',
    'checkout.address': 'Address',
    'checkout.payment_method': 'Payment Method',
    'checkout.tbc_bank': 'TBC Bank',
    'checkout.bog_bank': 'Bank Of Georgia',
    'checkout.place_order': 'Place Order',
    'checkout.processing': 'Processing...',
    'checkout.cart_empty': 'Your cart is empty',
    'checkout.enter_first_name': 'Enter your first name',
    'checkout.enter_last_name': 'Enter your last name',
    'checkout.enter_phone': 'Enter your phone number',
    'checkout.enter_city': 'Enter your city',
    'checkout.enter_address': 'Enter your full address',
    'checkout.ssl_protected': 'Secure checkout protected by SSL',
    'checkout.multiple_payment': 'Multiple payment options available',

    // Categories
    'category.men_collection': "Men's Collection",
    'category.men_subtitle': 'Timeless Elegance for the Modern Gentleman',
    'category.men_description': 'Discover our curated selection of premium menswear, crafted with the finest materials and attention to detail. From classic dress shirts to tailored suits, each piece embodies sophistication and style.',
    'category.women_collection': "Women's Collection",
    'category.women_subtitle': 'Sophisticated Style for the Modern Woman',
    'category.women_description': "Explore our exquisite women's collection featuring elegant dresses, luxurious blouses, and timeless pieces that celebrate femininity and grace. Each garment is designed to empower and inspire.",
    'category.men_categories': "Men's Categories",
    'category.women_categories': "Women's Categories",
    'category.discover_men': "Discover our premium men's collection across different categories",
    'category.explore_women': "Explore our elegant women's collection across different categories",
    'category.new_arrivals': 'New Arrivals',
    'category.new_arrivals_subtitle': 'Latest from Maison Nikolas',
    'category.new_arrivals_description': 'Be the first to discover our newest pieces. Fresh designs that embody our commitment to timeless elegance and modern sophistication.',
    'category.sale': 'Sale Collection',
    'category.sale_subtitle': 'Exceptional Value on Premium Pieces',
    'category.sale_description': 'Discover our carefully selected sale items featuring the same exceptional quality and timeless style at special prices. Limited time offers on luxury pieces from our premium collections.',
    'category.items': 'items',
    'category.no_products': 'No products found',
    'category.adjust_filters': 'Try adjusting your filters or check back later for new arrivals.',
    'category.stay_updated': 'Stay Updated',
    'category.newsletter_description': 'Be the first to know about new collections and exclusive offers',

    // Sale page
    'sale.title': 'SALE',
    'sale.subtitle': 'Selected Items at Special Prices',
    'sale.description': 'Discover exceptional value on our premium collection. Quality and style at special prices.',
    'sale.highest_discount': 'Highest Discount',
    'sale.no_sale_items': 'No sale items available',
    'sale.check_back': 'Check back later for new sale items and special offers.',

    // Common
    'common.home': 'Home',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.newest_first': 'Newest First',
    'common.price_low_high': 'Price: Low to High',
    'common.price_high_low': 'Price: High to Low',
    'common.name_az': 'Name A-Z',
    'common.all_categories': 'All Categories',
    'common.back_to_home': 'Back to Home',
    'common.product_not_found': 'Product Not Found',
    'common.product_not_found_desc': "The product you're looking for doesn't exist.",
    'common.save': 'Save',
    'common.required': 'required',

    // Product categories
    'categories.shirts': 'Shirts',
    'categories.suits': 'Suits',
    'categories.casual': 'Casual Wear',
    'categories.dresses': 'Dresses',
    'categories.blouses': 'Blouses',
    'categories.skirts': 'Skirts',

    // Badges
    'badges.new': 'NEW',
    'badges.limited': 'LIMITED',
    'badges.featured': 'Featured',
    'badges.off': 'OFF',
    'badges.save': 'Save',

    // Order
    'order.confirmed': 'Order Confirmed!',
    'order.thank_you': 'Thank you for your purchase',
    'order.order_number': 'Order',
    'order.customer_info': 'Customer Information',
    'order.order_info': 'Order Information',
    'order.order_date': 'Order Date',
    'order.payment': 'Payment',
    'order.status': 'Status',
    'order.items_ordered': 'Items Ordered',
    'order.order_status': 'Order Status',
    'order.order_placed': 'Order Placed',
    'order.processing': 'Processing',
    'order.delivered': 'Delivered',
    'order.not_found': 'Order Not Found',
    'order.not_found_desc': "The order you're looking for doesn't exist or has been removed.",
  }
};

// Function to detect if IP is from Georgia
const detectGeorgianIP = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code === 'GE';
  } catch (error) {
    console.error('Error detecting IP location:', error);
    // Default to Georgian if detection fails
    return true;
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'ka' | 'en'>('ka');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check if user has a saved language preference
        const savedLanguage = localStorage.getItem('language') as 'ka' | 'en' | null;
        
        if (savedLanguage) {
          setLanguage(savedLanguage);
        } else {
          // Detect IP location
          const isGeorgian = await detectGeorgianIP();
          const detectedLanguage = isGeorgian ? 'ka' : 'en';
          setLanguage(detectedLanguage);
          localStorage.setItem('language', detectedLanguage);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
        // Default to Georgian
        setLanguage('ka');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []);

  const handleSetLanguage = (lang: 'ka' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-navy-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-navy-900">Loading...</p>
        </div>
      </div>
    );
  }

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};