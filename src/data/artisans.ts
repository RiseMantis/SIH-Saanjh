import type { Artisan } from '../types';

export const images = {
  saree: "/cd3f6a7b-0fec-4134-aede-919095ae2caf.jpg",
  pottery: "/135c47da-9c2c-4fe5-bce7-4365c1900a42.jpg",
  jewelry: "/595bef14-9a37-451c-be49-ba1bff257ecb.jpg",
  woodwork: "/e3001f84-6a43-47fd-9471-7934448c693a.jpg",
  warli: "/6ba30b84-70f0-4e45-b69c-a7db45941994.jpg",
  bluePottery: "/593725bd-08fb-4943-8d50-d49f25e68fb8.jpg",
  brassLamp: "/fd256817-ae13-4f29-97f8-6298d6a34afc.jpg",
  basket: "/7b2a01d5-cb5d-48d5-ab0b-308b6c60322c.jpg",
  artisanWoman: "/ccf15a13-79ed-4161-8cb3-f7c0bb1d31ed.jpg",
  artisanMan: "/6e7ee150-03ef-45b8-ac7c-4f170456558d.jpg"
};

export const artisans: Artisan[] = [
{
  id: 'a1',
  name: 'Lakshmi Devi',
  village: 'Chanderi',
  district: 'Ashoknagar, MP',
  photo: images.artisanWoman,
  craft: 'Textiles',
  trustScore: 4.6,
  groupName: 'Chanderi Bunkar Samuh',
  groupMembers: 12,
  ongoingOrders: 2,
  completedOrders: 47,
  about:
  'I have been weaving cotton and silk sarees on my family handloom for 22 years. My mother taught me the Chanderi butti motifs. I work with eleven other women in our village group.',
  priceRangeLow: 900,
  priceRangeHigh: 6500,
  bulkCapable: true,
  monthlyCapacity: 18,
  starredWorks: [images.saree, images.warli, images.basket],
  reviews: [
  {
    id: 'r1',
    buyerName: 'Ananya R.',
    rating: 5,
    text: 'The zari border is even finer than the photos. Arrived carefully wrapped in cloth.',
    date: '12 Aug 2026'
  },
  {
    id: 'r2',
    buyerName: 'Vikram S.',
    rating: 4,
    text: 'Beautiful weave. Took two days longer than estimated, but she messaged to explain.',
    date: '2 Jul 2026'
  }]

},
{
  id: 'a2',
  name: 'Ramesh Kumbhar',
  village: 'Bhuj',
  district: 'Kutch, Gujarat',
  photo: images.artisanMan,
  craft: 'Pottery',
  trustScore: 4.9,
  groupName: 'Kutch Mitti Collective',
  groupMembers: 8,
  ongoingOrders: 3,
  completedOrders: 132,
  about:
  'Third-generation potter from Bhuj. I throw water pots, planters and terracotta lamps on a kick wheel and fire them in a wood kiln behind my house.',
  priceRangeLow: 250,
  priceRangeHigh: 3200,
  bulkCapable: true,
  monthlyCapacity: 60,
  starredWorks: [images.pottery, images.bluePottery, images.brassLamp],
  reviews: [
  {
    id: 'r3',
    buyerName: 'Meera P.',
    rating: 5,
    text: 'Ordered 20 planters for our café. Not one cracked in transit.',
    date: '28 Aug 2026'
  }]

},
{
  id: 'a3',
  name: 'Sunita Bai',
  village: 'Dahanu',
  district: 'Palghar, Maharashtra',
  photo: images.artisanWoman,
  craft: 'Painting',
  trustScore: 4.3,
  groupName: 'Warli Kalakar Mandal',
  groupMembers: 6,
  ongoingOrders: 1,
  completedOrders: 23,
  about:
  'I paint Warli stories — harvest, marriage, the tarpa dance — on handmade paper and cloth using rice paste and a bamboo stick.',
  priceRangeLow: 600,
  priceRangeHigh: 12000,
  bulkCapable: false,
  monthlyCapacity: 6,
  starredWorks: [images.warli, images.saree],
  reviews: [
  {
    id: 'r4',
    buyerName: 'Corporate Gifting, Zeta',
    rating: 5,
    text: 'Commissioned 12 framed pieces as client gifts. Each one signed.',
    date: '19 Jun 2026'
  }]

},
{
  id: 'a4',
  name: 'Imran Ansari',
  village: 'Moradabad',
  district: 'Uttar Pradesh',
  photo: images.artisanMan,
  craft: 'Metalwork',
  trustScore: 4.7,
  groupName: 'Peetal Nagri Karigar Group',
  groupMembers: 15,
  ongoingOrders: 4,
  completedOrders: 89,
  about:
  'I hand-engrave brass lamps, urns and trays. My workshop has four artisans and we take festival orders together.',
  priceRangeLow: 400,
  priceRangeHigh: 8000,
  bulkCapable: true,
  monthlyCapacity: 120,
  starredWorks: [images.brassLamp, images.jewelry],
  reviews: [
  {
    id: 'r5',
    buyerName: 'Deepa K.',
    rating: 5,
    text: 'The engraving detail is remarkable for the price.',
    date: '4 Sep 2026'
  }]

}];


export const artisanById = (id: string) => artisans.find((a) => a.id === id);

export const currentArtisan = artisans[0];