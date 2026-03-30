import { fetchAd } from '../dist/index.js';

console.log('Fetching ad with demo zone key...\n');

const ad = await fetchAd();

if (!ad) {
	console.error('No ad returned. The zone may be sold out or rate-limited.');
	process.exit(1);
}

console.log('Company:     ', ad.company || '(none)');
console.log('Tagline:     ', ad.companyTagline || '(none)');
console.log('Description: ', ad.description);
console.log('CTA:         ', ad.callToAction);
console.log('Link:        ', ad.link ? 'OK' : 'MISSING');
console.log('Logo:        ', ad.logo ? 'OK' : 'MISSING');
console.log('Image:       ', ad.image ? 'OK' : 'MISSING');
console.log('StatView:    ', ad.statviewUrl ? 'OK' : 'MISSING');
console.log('\nfetchAd() OK');
