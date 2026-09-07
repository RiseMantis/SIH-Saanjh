import type { AppNotification, MatchResult } from '../types';
import { images } from './artisans';

export const notifications: AppNotification[] = [
{
  id: 'n1',
  kind: 'scheme',
  headline: 'New loom subsidy open for your village',
  spoken:
  'There is a new loom subsidy for weavers in Chanderi. It pays half the cost of a new loom. Applications close on the thirtieth of September.',
  detail:
  'The state handloom board will pay 50% of the cost of a new pit loom, up to ₹18,000. You already have the documents needed in your DigiLocker. We can apply for you — you only need to say yes.',
  date: 'Today'
},
{
  id: 'n2',
  kind: 'fair',
  headline: 'Handloom Week in Chanderi, 11 to 14 October',
  spoken:
  'There is a craft fair in Chanderi from the eleventh to the fourteenth of October. Stalls are free for group members.',
  detail:
  'Handloom Week is 6 km from your village. Stalls are free for registered group members. Transport for your bundles is arranged by the group on the first morning.',
  date: 'Yesterday'
},
{
  id: 'n3',
  kind: 'order',
  headline: 'Ananya paid for your red saree',
  spoken: 'Ananya from Bengaluru has paid one thousand eight hundred rupees for your red saree.',
  detail:
  'The money is in your account. Nothing else is needed from you for this order — just pack and hand it to the pickup agent on Monday.',
  date: '2 days ago'
}];


export const notificationById = (id: string) =>
notifications.find((n) => n.id === id);

export const matchResults: MatchResult[] = [
{
  id: 'm1',
  type: 'cluster',
  name: '4 artisans in Bhuj',
  location: 'Kutch, Gujarat',
  trustScore: 4.8,
  capacity: 60,
  unitPrice: 610,
  deliveryDays: 18,
  members: ['Ramesh Kumbhar', 'Jayaben Rabari', 'Hasan Bhai', 'Kanta Ben'],
  photo: images.pottery
},
{
  id: 'm2',
  type: 'cluster',
  name: '3 artisans in Moradabad',
  location: 'Uttar Pradesh',
  trustScore: 4.7,
  capacity: 90,
  unitPrice: 685,
  deliveryDays: 14,
  members: ['Imran Ansari', 'Nadeem Ali', 'Salma Begum'],
  photo: images.brassLamp
},
{
  id: 'm3',
  type: 'artisan',
  name: 'Ramesh Kumbhar',
  location: 'Bhuj, Gujarat',
  trustScore: 4.9,
  capacity: 60,
  unitPrice: 640,
  deliveryDays: 21,
  photo: images.artisanMan
},
{
  id: 'm4',
  type: 'artisan',
  name: 'Lakshmi Devi',
  location: 'Chanderi, MP',
  trustScore: 4.6,
  capacity: 18,
  unitPrice: 720,
  deliveryDays: 26,
  photo: images.artisanWoman
}];