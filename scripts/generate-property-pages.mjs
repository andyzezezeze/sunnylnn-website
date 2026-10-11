import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(projectRoot, 'dist');
const sourceRoot = join(projectRoot, 'Webside property pictures');
const template = readFileSync(join(projectRoot, 'scripts', 'property-template.html'), 'utf8');

const properties = [
  { slug: 'glacier', name: 'Glacier', location: 'Vauxhall · London', folder: 'Glacier_Vauxhall' },
  { slug: 'boxwood-gardens', name: 'Boxwood Gardens', location: 'Tower Bridge · London', folder: 'BoxwoodGardens_TowerBridge' },
  { slug: 'bankside-tower', name: 'Bankside Tower', location: 'Waterloo · London', folder: 'BanksideTower_Waterloo' },
  { slug: 'merino-gardens', name: 'Merino Gardens', location: 'Tower Bridge · London', folder: 'MerinoGardens_TowerBridge' },
  { slug: 'neroli', name: 'Neroli', location: 'Aldgate · London', folder: 'Neroli_Aldgate' },
  { slug: 'penthouse-wharf', name: 'Penthouse Wharf', location: 'Canary Wharf · London', folder: 'PenthouseWharf_CanaryWharf' },
  { slug: 'queens-gate', name: 'Queens Gate', location: 'South Kensington · London', folder: 'QueensGate_SouthKensington' }
];

function numberedPhotos(folder) {
  return readdirSync(join(sourceRoot, folder))
    .filter(file => /^\d+\.jpg$/i.test(file))
    .map(file => Number.parseInt(file, 10))
    .sort((a, b) => a - b);
}

function galleryClass(number, total) {
  if (number === 2) return 'gallery-wide';
  if (number === total && [6, 9].includes(total)) return 'gallery-finale';
  if ([3, 4, 6, 7, 9, 10].includes(number)) return 'gallery-half';
  if (number === 5) return 'gallery-inset';
  if (number === 8) return 'gallery-wide';
  if (number === 11) return 'gallery-inset gallery-inset-right';
  return 'gallery-finale';
}

function twoDigits(value) {
  return String(value).padStart(2, '0');
}

function galleryMarkup(property, photos) {
  return photos.slice(1).map((number, index) => {
    const count = photos.length;
    const className = galleryClass(number, count);
    return '        <figure class="property-photo ' + className + ' reveal" data-gallery-index="' + (index + 1) + '"><button class="gallery-open" type="button" aria-label="Open photograph ' + number + '"><img src="assets/listings/' + property.slug + '/gallery/' + number + '.jpg" alt="' + property.name + ' photograph ' + number + '" loading="lazy"><span class="photo-number">' + twoDigits(number) + ' / ' + twoDigits(count) + '</span></button></figure>';
  }).join('\n');
}

for (const property of properties) {
  const photos = numberedPhotos(property.folder);
  if (!photos.length || photos[0] !== 1 || photos.some((number, index) => number !== index + 1)) {
    throw new Error('Photo sequence is incomplete for ' + property.name);
  }

  const galleryDirectory = join(distRoot, 'assets', 'listings', property.slug, 'gallery');
  mkdirSync(galleryDirectory, { recursive: true });
  for (const number of photos) {
    const source = join(sourceRoot, property.folder, number + '.jpg');
    if (!existsSync(source)) throw new Error('Missing ' + source);
    copyFileSync(source, join(galleryDirectory, number + '.jpg'));
  }

  const [area] = property.location.split(' · ');
  const values = {
    '{{NAME}}': property.name,
    '{{SLUG}}': property.slug,
    '{{LOCATION}}': property.location,
    '{{LOCATION_DESCRIPTION}}': property.location.replace(' · ', ', '),
    '{{AREA}}': area,
    '{{COUNT}}': twoDigits(photos.length),
    '{{PHOTO_LABEL}}': photos.length + ' photographs',
    '{{GALLERY}}': galleryMarkup(property, photos)
  };

  let output = template;
  for (const [token, value] of Object.entries(values)) output = output.replaceAll(token, value);
  writeFileSync(join(distRoot, property.slug + '.html'), output);
  console.log(property.name + ': ' + photos.length + ' photographs');
}
