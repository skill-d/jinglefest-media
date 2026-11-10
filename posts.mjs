// The 10-day Bake-Off plan. Every word on the images comes from here. Edit, then run: bun render.mjs
export const PHONES = '+91 80988 41307 / +91 9176040644';
const url = 'thejinglefest.com/kids/baking';
const kicker = 'Little Chefs Bake-Off';
// Early bird runs to Sunday 8 Nov, so only days 1–4 carry it.
const offer = { was: '₹749', now: '₹674', line: 'Early bird: 10% off till Sunday 8 Nov' };
export const posts = [
  { day: 1, date: '5 Nov', scene: 'bakers', kicker: "Children's Day special", head: 'Little Chefs<br><em>Bake-Off</em>', sub: 'Ages 8–12 and 13–16. <b>Only 20 slots.</b><br><b>14 November, 4:30 PM</b> at Bread & Brew.', offer, url },
  { day: 2, date: '6 Nov', scene: 'cookies', kicker, head: 'Pick your<br><em>challenge</em>', cards: [['Ages 8–12', '2 decorated cookies'], ['Ages 13–16', '1 cookie + 1 brownie or cake']], offer, url },
  { day: 3, date: '7 Nov', scene: 'dough', kicker, head: 'You do<br><em>the baking</em>', sub: 'Our team helps you with the oven.<br><b>14 November, 4:30 PM</b> at Bread & Brew.', offer, url },
  { day: 4, date: '8 Nov', scene: 'kit', kicker, head: 'Ingredients?<br><em>Sorted.</em>', sub: 'Flour, sugar, butter, chocolate and salt are on us.<br><b>Bring your own tins and baking equipment.</b>', offer: { ...offer, line: 'Early bird: 10% off ends tonight' }, url },
  { day: 5, date: '9 Nov', scene: 'judged', kicker, head: 'Taste. Decoration.<br><em>Creativity.</em>', sub: 'Your bakes are judged on all three.<br><b>Only 20 slots.</b>', url },
  { day: 6, date: '10 Nov', scene: 'finals', kicker, head: 'Win your<br><em>own stall</em>', sub: 'One winner per age group gets a Carnival day stall.<br><b>Both stalls sponsored by Bread & Brew.</b>', url },
  { day: 7, date: '11 Nov', scene: 'share', kicker, head: 'Bake. Share.<br><em>Make friends.</em>', sub: 'Bakers take their creations home.<br><b>Share them around and make new friends.</b>', url },
  { day: 8, date: '12 Nov', scene: 'gift', kicker, head: 'Nobody goes<br><em>home empty</em>', sub: 'Every little chef gets a gift bag. Winners get <b>a surprise so secret, even our oven doesn’t know.</b>', url },
  { day: 9, date: '13 Nov', scene: 'lastcall', kicker: 'Last call', head: 'Tomorrow!', sub: 'Little Chefs Bake-Off.<br><b>14 November, 4:30 PM</b> at Bread & Brew,<br>Thailavaram Bus Stop, GST Road, Potheri.', burst: 'Register now', url },
  { day: 10, date: '14 Nov', scene: 'today', kicker: 'Bake-Off today', head: 'Happy<br><em>Children’s Day</em>', sub: 'The Little Chefs Bake-Off is on today.<br><b>4:30 PM</b> at Bread & Brew.', url },
];

// Band Battle posts, feed (1080 x 1350) and story (1080 x 1920). Words from the /music page. Render all with: bun render.mjs band
export const bandPost = { scene: 'band', kicker: 'Band Battle', nosponsor: true, head: 'Band<br><em>Battle</em>', sub: '<b>5 bands</b> of 2–5 members.<br><b>Screening 28 November.</b><br>Final at the Christmas Carnival on <b>6 December</b>.', url: 'thejinglefest.com/music' };
export const bandJoinPost = { file: 'band-battle-got-a-band', scene: 'rehearsal', kicker: 'Band Battle', nosponsor: true, head: 'Got a<br><em>band?</em>', sub: '<b>College bands</b> of 2–5 members.<br><b>Christmas songs only.</b><br>₹350 a person + ₹550 a band. Dinner included.', url: 'thejinglefest.com/music' };
export const bandPrizePost = { file: 'band-battle-prize', scene: 'stage', kicker: 'Band Battle', nosponsor: true, head: 'Play for<br><em>the prize</em>', sub: 'A <b>cash prize</b> + <b>dine-in coupons</b>.<br>The winner is picked by <b>public vote</b>.', cards: [['Screening', '28 November'], ['Final', '6 December']], url: 'thejinglefest.com/music' };

// Christmas Carnival save-the-date feed post (1080 x 1350). Date only: venue and time aren't confirmed. Render with: bun render.mjs carnival
export const carnivalPost = { scene: 'carnival', kicker: 'Save the date', nosponsor: true, scale: 1.03, qrTop: true, head: 'Christmas<br><em>Carnival</em>', sub: '<b>Sunday 6 December 2026</b><br>Stalls and the <b>Band Battle final</b> are part of it.', url: 'thejinglefest.com' };
