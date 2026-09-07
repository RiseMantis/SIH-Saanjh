import type { Fair, Product } from '../types';
import { images } from './artisans';

export const products: Product[] = [
{
  id: 'p1',
  title: 'Hand-woven cotton saree, red and gold',
  artisanId: 'a1',
  category: 'Textiles',
  price: 1800,
  images: [images.saree],
  description:
  'A hand-woven cotton saree in deep red with a golden zari border, made on a pit loom over nine days. The butti motifs are placed by hand, so no two sarees are identical. Length 5.5 metres with a matching blouse piece.',
  likes: 214,
  bulkAvailable: true,
  madeIn: 'Chanderi, MP'
},
{
  id: 'p2',
  title: 'Terracotta water pot with incised bands',
  artisanId: 'a2',
  category: 'Pottery',
  price: 640,
  images: [images.pottery],
  description:
  'Wheel-thrown terracotta water pot, wood-fired for 14 hours. The incised bands around the neck are cut with a bamboo tool while the clay is still soft. Keeps water naturally cool.',
  likes: 389,
  isVideo: true,
  bulkAvailable: true,
  madeIn: 'Bhuj, Gujarat'
},
{
  id: 'p3',
  title: 'Oxidised silver tribal necklace with bells',
  artisanId: 'a4',
  category: 'Jewelry',
  price: 2450,
  images: [images.jewelry],
  description:
  'Oxidised silver-alloy necklace strung with small bells and turquoise beads, in the Banjara style. Each bell is hammered and closed by hand.',
  likes: 156,
  bulkAvailable: false,
  madeIn: 'Moradabad, UP'
},
{
  id: 'p4',
  title: 'Carved rosewood elephant with floral work',
  artisanId: 'a4',
  category: 'Woodwork',
  price: 3200,
  images: [images.woodwork],
  description:
  'Solid rosewood elephant, carved from a single block with chisels and finished with beeswax. The floral relief on the back takes two full days.',
  likes: 92,
  bulkAvailable: true,
  madeIn: 'Moradabad, UP'
},
{
  id: 'p5',
  title: 'Warli harvest painting on handmade paper',
  artisanId: 'a3',
  category: 'Painting',
  price: 1650,
  images: [images.warli],
  description:
  'A Warli painting of the harvest dance in rice paste on brown handmade paper, drawn with a chewed bamboo stick. Unframed, 30 × 40 cm.',
  likes: 431,
  bulkAvailable: false,
  madeIn: 'Dahanu, Maharashtra'
},
{
  id: 'p6',
  title: 'Blue pottery plates, set of six',
  artisanId: 'a2',
  category: 'Pottery',
  price: 2900,
  images: [images.bluePottery],
  description:
  'Six Jaipur-style blue pottery plates glazed in cobalt and white with a floral centre. Low-fired quartz body, hand-painted with a squirrel-hair brush.',
  likes: 268,
  bulkAvailable: true,
  madeIn: 'Bhuj, Gujarat'
},
{
  id: 'p7',
  title: 'Engraved brass diya lamp',
  artisanId: 'a4',
  category: 'Metalwork',
  price: 780,
  images: [images.brassLamp],
  description:
  'Hand-engraved brass oil lamp with a lotus base. Beaten from sheet brass and chased with hand punches. Ships polished and lacquered.',
  likes: 517,
  bulkAvailable: true,
  madeIn: 'Moradabad, UP'
},
{
  id: 'p8',
  title: 'Woven jute and cane storage basket',
  artisanId: 'a1',
  category: 'Basketry',
  price: 950,
  images: [images.basket],
  description:
  'Storage basket coiled from jute rope over a cane frame, with a geometric band in undyed fibre. Holds about 12 litres.',
  likes: 143,
  bulkAvailable: true,
  madeIn: 'Chanderi, MP'
}];


export const productById = (id: string) => products.find((p) => p.id === id);

export const fairs: Fair[] = [
{
  id: 'f1',
  name: 'Dilli Haat Craft Mela',
  city: 'New Delhi',
  dates: '18–24 Sep',
  image: images.brassLamp,
  stalls: 120
},
{
  id: 'f2',
  name: 'Kutch Rann Utsav Bazaar',
  city: 'Bhuj',
  dates: '2–9 Oct',
  image: images.pottery,
  stalls: 84
},
{
  id: 'f3',
  name: 'Handloom Week, Chanderi',
  city: 'Ashoknagar',
  dates: '11–14 Oct',
  image: images.saree,
  stalls: 46
}];