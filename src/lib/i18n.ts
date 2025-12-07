export type Locale = 'en' | 'fr-CA'

export const locales: Locale[] = ['en', 'fr-CA']

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    categories: 'Categories',
    brands: 'Brands',
    collections: 'Collections',
    sale: 'Sale',
    search: 'Search...',
    cart: 'Cart',
    account: 'Account',
    menu: 'Menu',
    
    // Homepage
    heroTitle: 'The New Address of Luxury Menswear',
    heroSubtitle: 'Discover exceptional pieces from the world\'s most prestigious brands',
    shopNow: 'Shop Now',
    featuredProducts: 'Featured Products',
    newArrivals: 'New Arrivals',
    viewAll: 'View All',
    
    // Product
    addToCart: 'Add to Cart',
    price: 'Price',
    size: 'Size',
    color: 'Color',
    material: 'Material',
    madeIn: 'Made In',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    
    // Cart
    emptyCart: 'Your cart is empty',
    continueShoppingButton: 'Continue Shopping',
    total: 'Total',
    checkout: 'Checkout',
    quantity: 'Quantity',
    
    // Categories
    outerwear: 'Outerwear',
    clothing: 'Clothing',
    footwear: 'Footwear',
    accessories: 'Accessories',
    bags: 'Bags',
    watches: 'Watches',
    homeTextiles: 'Home Textiles',
    
    // Footer
    aboutUs: 'About Us',
    contact: 'Contact',
    faq: 'FAQ',
    shipping: 'Shipping',
    returns: 'Returns',
    sizeGuide: 'Size Guide',
    privacy: 'Privacy',
    terms: 'Terms'
  },
  
  'fr-CA': {
    // Navigation
    home: 'Accueil',
    categories: 'Catégories',
    brands: 'Marques',
    collections: 'Collections',
    sale: 'Solde',
    search: 'Rechercher...',
    cart: 'Panier',
    account: 'Compte',
    menu: 'Menu',
    
    // Homepage
    heroTitle: 'La Nouvelle Adresse de la Mode Masculine de Luxe',
    heroSubtitle: 'Découvrez des pièces exceptionnelles des marques les plus prestigieuses au monde',
    shopNow: 'Magasiner Maintenant',
    featuredProducts: 'Produits Vedettes',
    newArrivals: 'Nouveautés',
    viewAll: 'Voir Tout',
    
    // Product
    addToCart: 'Ajouter au Panier',
    price: 'Prix',
    size: 'Taille',
    color: 'Couleur',
    material: 'Matière',
    madeIn: 'Fabriqué En',
    inStock: 'En Stock',
    outOfStock: 'Rupture de Stock',
    
    // Cart
    emptyCart: 'Votre panier est vide',
    continueShoppingButton: 'Continuer les Achats',
    total: 'Total',
    checkout: 'Commander',
    quantity: 'Quantité',
    
    // Categories
    outerwear: 'Vêtements d\'Extérieur',
    clothing: 'Vêtements',
    footwear: 'Chaussures',
    accessories: 'Accessoires',
    bags: 'Sacs',
    watches: 'Montres',
    homeTextiles: 'Textiles pour la Maison',
    
    // Footer
    aboutUs: 'À Propos',
    contact: 'Contact',
    faq: 'FAQ',
    shipping: 'Livraison',
    returns: 'Retours',
    sizeGuide: 'Guide des Tailles',
    privacy: 'Confidentialité',
    terms: 'Conditions'
  }
}

export function useTranslation(locale: Locale = 'en') {
  return {
    t: (key: keyof typeof translations.en) => translations[locale][key] || translations.en[key],
    locale
  }
}