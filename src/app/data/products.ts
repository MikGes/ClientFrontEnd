// components/data/products.ts

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  features: string[];
  image: string;
}

export const interiorProducts: Product[] = [
  {
    id: 1,
    name: 'Wall Art Collection',
    category: 'Decor',
    price: '$199',
    description: 'Curated collection of premium wall art pieces to elevate your interior spaces.',
    features: ['Hand-selected pieces', 'Museum-quality prints', 'Various sizes included', 'Ready to hang'],
    image: 'art1'
  },
  {
    id: 2,
    name: 'Designer Lighting',
    category: 'Lighting',
    price: '$299',
    description: 'Statement lighting fixtures that combine functionality with artistic design.',
    features: ['Energy-efficient LED', 'Dimmable', 'Handcrafted metal', '3-year warranty'],
    image: 'lamp1'
  },
  {
    id: 3,
    name: 'Premium Curtains',
    category: 'Textiles',
    price: '$149',
    description: 'Luxurious curtains made from high-quality fabric with thermal and blackout properties.',
    features: ['Blackout lining', 'Thermal insulation', 'Machine washable', 'Custom sizing available'],
    image: 'curtain1'
  },
  {
    id: 4,
    name: 'Area Rug',
    category: 'Flooring',
    price: '$349',
    description: 'Handwoven area rug with intricate patterns and premium materials for lasting beauty.',
    features: ['Handwoven wool', 'Non-slip backing', 'Stain-resistant', 'Ethically sourced'],
    image: 'rug1'
  },
  {
    id: 5,
    name: 'Decorative Vases',
    category: 'Decor',
    price: '$89',
    description: 'Set of artisan-crafted ceramic vases in complementary shapes and finishes.',
    features: ['Hand-thrown ceramic', 'Glazed finish', 'Set of 3 sizes', 'Waterproof interior'],
    image: 'vase1'
  },
  {
    id: 6,
    name: 'Mirror Set',
    category: 'Wall Decor',
    price: '$249',
    description: 'Elegant mirror set with wooden frames to enhance light and space in any room.',
    features: ['Solid wood frames', 'Beveled edges', 'Wall mounting hardware included', 'Set of 2 different sizes'],
    image: 'mirror1'
  },
];