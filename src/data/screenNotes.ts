export interface ScreenNote {
  match: string;
  title: string;
  mode: 'artisan' | 'buyer' | 'shared';
  purpose: string;
  voicePrompt: string;
  notes: string[];
}

/** Ordered most-specific first — the annotation panel picks the first prefix match. */
export const screenNotes: ScreenNote[] = [
{
  match: '/artisan/add',
  title: 'Add product (4 steps + success)',
  mode: 'artisan',
  purpose:
  'The single most important flow in the app. One action per screen: photo, then voice description, then price, then publish.',
  voicePrompt:
  'Point your phone at what you made and press the big button. I will clean up the photo for you.',
  notes: [
  'Every AI output is reviewable: before/after slider, play-back, re-record one line',
  'Only 1 photo is required; up to 5 allowed',
  'Voice reads the full listing back before the publish tap']

},
{
  match: '/artisan/home',
  title: 'Artisan home',
  mode: 'artisan',
  purpose:
  'Exists only to get the artisan into one of four actions fast. No feed, no search, no discovery.',
  voicePrompt:
  "This is your home. Say 'add new product' to list something, or 'my orders' to check on your sales.",
  notes: [
  'Add a new product occupies roughly a third of the screen',
  'Three summary cards: orders, trust score, new scheme',
  'Every icon carries a text label']

},
{
  match: '/artisan/orders',
  title: 'My orders',
  mode: 'artisan',
  purpose:
  'Two chips instead of a filter panel. Status is a single colour-coded word paired with an icon.',
  voicePrompt:
  'These are your orders. Two are still being made. Tap any order and I will read it to you.',
  notes: [
  'Vertical icon stepper on detail, not a text log',
  'Cluster orders show every member’s contribution']

},
{
  match: '/artisan/account',
  title: 'My account',
  mode: 'artisan',
  purpose:
  'Large tappable rows, not a dense settings list. Documents, earnings, story, language, help.',
  voicePrompt:
  'This is your account. You can record your story, check your documents, or see your earnings.',
  notes: [
  'DigiLocker status as a green check or "action needed"',
  'Mode indicator lives here — never a hard device lock']

},
{
  match: '/artisan/notification',
  title: 'Scheme / notification detail',
  mode: 'artisan',
  purpose:
  'One short sentence, a large icon, and "Tell me more" in voice instead of paragraphs of scheme text.',
  voicePrompt:
  'There is a new loom subsidy for weavers in your village. Shall I read the details?',
  notes: ['Reached from the home banner, never a fifth tab']
},
{
  match: '/artisan/signup',
  title: 'Artisan signup (voice-guided)',
  mode: 'artisan',
  purpose:
  'One field visible at a time: phone, then OTP, then optional DigiLocker consent explained in plain speech.',
  voicePrompt:
  'Tell me your phone number, or type it here. I will read each number back to you.',
  notes: ['No screen ever shows two decisions at once']
},
{
  match: '/buyer/request',
  title: 'Post a request (B2B)',
  mode: 'buyer',
  purpose:
  'Structured bulk sourcing: requirement form, ranked artisans and auto-formed clusters, then a payment-terms panel that earns corporate trust.',
  voicePrompt: 'You can dictate special requirements instead of typing them.',
  notes: [
  'Clusters are first-class results, not a footnote',
  'Invoice discounting explained as its own designed panel',
  'ESG impact report is a business-tier surface']

},
{
  match: '/buyer/discover',
  title: 'Discover feed',
  mode: 'buyer',
  purpose:
  'Vertical feed of artisan posts with category chips pinned, plus a fairs shelf so offline events are discoverable too.',
  voicePrompt: 'You can also say: find me Warli art under two thousand rupees.',
  notes: ['Standard 14–16px density', 'Voice is a convenience layer here, not the primary mode']
},
{
  match: '/buyer/search',
  title: 'Search + results',
  mode: 'buyer',
  purpose:
  'Persistent search field with an embedded mic. Filters include trust score minimum and bulk availability.',
  voicePrompt: 'Say what you are looking for and a price limit.',
  notes: ['Everything reachable by tap and type as well as voice']
},
{
  match: '/buyer/product',
  title: 'Product + artisan detail',
  mode: 'buyer',
  purpose:
  'Product gallery and AI description above the full artisan module: village, group, order counts, trust, starred works, reviews.',
  voicePrompt: 'Ask a question and the artisan hears it in their own language.',
  notes: ['About section is read-only to buyers', 'Bulk actions appear only for business accounts']
},
{
  match: '/buyer/artisan',
  title: 'Artisan profile',
  mode: 'buyer',
  purpose:
  'The trust surface: who made this, with whom, how much they have delivered, and what buyers said.',
  voicePrompt: '',
  notes: ['Trust badge component is identical everywhere an artisan is referenced']
},
{
  match: '/buyer/orders',
  title: 'Orders (buyer)',
  mode: 'buyer',
  purpose:
  'Standard history with horizontal stepper, invoice access, reorder, and a review prompt after delivery.',
  voicePrompt: '',
  notes: ['Same tracker component as artisan mode, horizontal variant']
},
{
  match: '/buyer/account',
  title: 'Account (buyer)',
  mode: 'buyer',
  purpose:
  'Wishlist, addresses, payment, and the individual/business toggle that governs whether B2B surfaces appear.',
  voicePrompt: '',
  notes: ['Business toggle is the progressive-disclosure switch for the whole buyer mode']
},
{
  match: '/buyer/signup',
  title: 'Buyer signup',
  mode: 'buyer',
  purpose:
  'Standard signup, then one question: buying for yourself or for a business.',
  voicePrompt: '',
  notes: ['The answer decides whether bulk, ESG and financing ever appear']
},
{
  match: '/language',
  title: 'Language selection',
  mode: 'shared',
  purpose:
  'Comes before login, not after. Each language is written in its own script and spoken aloud on tap.',
  voicePrompt: 'Choose the language you speak. Tap any name and I will say it out loud.',
  notes: ['Devanagari and other scripts validated at their real sizes']
},
{
  match: '/',
  title: 'First launch — role select',
  mode: 'shared',
  purpose:
  'A spoken greeting and exactly one decision: do you make crafts, or do you want to buy them?',
  voicePrompt: 'Welcome! Are you here to sell your craft, or to buy?',
  notes: ['Two large cards, both above the fold', 'Role is never locked to the device']
}];


export const noteForPath = (path: string) =>
screenNotes.find((n) => path.startsWith(n.match)) ??
screenNotes[screenNotes.length - 1];