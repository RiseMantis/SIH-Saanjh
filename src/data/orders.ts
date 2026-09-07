import type { Order } from '../types';

export const artisanOrders: Order[] = [
{
  id: 'ao1',
  productId: 'p1',
  counterpartName: 'Ananya Rao',
  counterpartLocation: 'Bengaluru',
  amount: 1800,
  quantity: 1,
  status: 'being-made',
  placedOn: '2 Sep 2026'
},
{
  id: 'ao2',
  productId: 'p8',
  counterpartName: 'Zeta Workspaces',
  counterpartLocation: 'Pune',
  amount: 19000,
  quantity: 20,
  status: 'ordered',
  placedOn: '4 Sep 2026',
  cluster: {
    othersCount: 3,
    members: [
    { name: 'You', units: 5, done: false },
    { name: 'Kamla Bai', units: 5, done: true },
    { name: 'Sarita Devi', units: 5, done: true },
    { name: 'Radha Bai', units: 5, done: false }]

  }
},
{
  id: 'ao3',
  productId: 'p2',
  counterpartName: 'Meera Pillai',
  counterpartLocation: 'Kochi',
  amount: 640,
  quantity: 1,
  status: 'shipped',
  placedOn: '29 Aug 2026'
},
{
  id: 'ao4',
  productId: 'p5',
  counterpartName: 'Rohit Menon',
  counterpartLocation: 'Mumbai',
  amount: 1650,
  quantity: 1,
  status: 'paid',
  placedOn: '14 Aug 2026'
},
{
  id: 'ao5',
  productId: 'p7',
  counterpartName: 'Deepa Krishnan',
  counterpartLocation: 'Chennai',
  amount: 1560,
  quantity: 2,
  status: 'delivered',
  placedOn: '1 Aug 2026'
}];


export const buyerOrders: Order[] = [
{
  id: 'bo1',
  productId: 'p1',
  counterpartName: 'Lakshmi Devi',
  counterpartLocation: 'Chanderi, MP',
  amount: 1800,
  quantity: 1,
  status: 'being-made',
  placedOn: '2 Sep 2026'
},
{
  id: 'bo2',
  productId: 'p6',
  counterpartName: 'Ramesh Kumbhar',
  counterpartLocation: 'Bhuj, Gujarat',
  amount: 2900,
  quantity: 1,
  status: 'shipped',
  placedOn: '30 Aug 2026'
},
{
  id: 'bo3',
  productId: 'p7',
  counterpartName: 'Imran Ansari',
  counterpartLocation: 'Moradabad, UP',
  amount: 15600,
  quantity: 20,
  status: 'delivered',
  placedOn: '12 Aug 2026',
  cluster: {
    othersCount: 3,
    members: [
    { name: 'Imran Ansari', units: 8, done: true },
    { name: 'Nadeem Ali', units: 6, done: true },
    { name: 'Salma Begum', units: 6, done: true }]

  }
},
{
  id: 'bo4',
  productId: 'p5',
  counterpartName: 'Sunita Bai',
  counterpartLocation: 'Dahanu, MH',
  amount: 1650,
  quantity: 1,
  status: 'paid',
  placedOn: '20 Jul 2026'
}];


export const orderById = (id: string) =>
[...artisanOrders, ...buyerOrders].find((o) => o.id === id);

export const statusMeta: Record<
  Order['status'],
  {label: string;tone: 'amber' | 'leaf' | 'ink' | 'clay';}> =
{
  ordered: { label: 'Ordered', tone: 'amber' },
  'being-made': { label: 'Being made', tone: 'clay' },
  shipped: { label: 'Shipped', tone: 'ink' },
  delivered: { label: 'Delivered', tone: 'leaf' },
  paid: { label: 'Paid', tone: 'leaf' }
};

export const statusOrder: Order['status'][] = [
'ordered',
'being-made',
'shipped',
'delivered',
'paid'];