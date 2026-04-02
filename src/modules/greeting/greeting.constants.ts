import {
  Season,
  TimeOfDay,
} from '../../providers/greeting-context/greeting-context.service';

export type OccasionImageMap = Record<string, Record<TimeOfDay, string[]>>;

export const SEASON_TIME_MESSAGES: Record<
  Season,
  Record<TimeOfDay, string[]>
> = {
  spring: {
    morning: [
      'Bună dimineața! Parfumul florilor de primăvară îți urează o zi plină de energie și bucurie.',
      'Bună dimineața! Primăvara te întâmpină cu aer proaspăt și soare blând — zi minunată!',
      'Bună dimineața! Lasă briza de primăvară să îți aducă optimism și vitalitate pentru ziua ce urmează.',
    ],
    afternoon: [
      'Bună ziua! Soarele de primăvară îți însoțește după-amiaza cu căldură și lumină.',
      'Bună ziua! Lasă briza primăvăratică și culorile înfloririi să îți aducă bucurie în această după-amiază.',
      'Bună ziua! Primăvara își arată splendoarea — sperăm că ziua ta este la fel de frumoasă.',
    ],
    evening: [
      'Bună seara! Primăvara și-a desfășurat culorile astăzi — seară plăcută și liniștită!',
      'Bună seara! Seara de primăvară îți aduce liniște și mirosul dulce al florilor.',
      'Bună seara! Fie ca seara aceasta de primăvară să îți aducă pace și mulțumire sufletească.',
    ],
    night: [
      'Noapte bună! Lasă liniștea nopții de primăvară să te poarte spre vise frumoase.',
      'Noapte bună! Noaptea de primăvară este blândă — odihnă binecuvântată și vise plăcute!',
      'Noapte bună! Cântecul greierilor de primăvară îți urează un somn liniștit și odihnitor.',
    ],
  },
  summer: {
    morning: [
      'Bună dimineața! O zi de vară însorită te așteaptă — bucură-te de fiecare clipă!',
      'Bună dimineața! Razele calde ale soarelui de vară îți luminează ziua cu energie și voie bună.',
      'Bună dimineața! Vara îți oferă o zi lungă și însorită — folosește-o cu bucurie!',
    ],
    afternoon: [
      'Bună ziua! Sperăm că te bucuri de această după-amiază caldă și însorită de vară.',
      'Bună ziua! Căldura verii aduce cu ea bucurii și amintiri frumoase — zi plăcută!',
      'Bună ziua! Vara este în toi — sperăm că după-amiaza aceasta îți aduce numai momente plăcute.',
    ],
    evening: [
      'Bună seara! Apusul de vară îți pictează cerul în culori de foc — seară magică!',
      'Bună seara! Răcoarea serii de vară este binevenită după o zi însorită — seară plăcută!',
      'Bună seara! Serile de vară sunt pline de magie și liniște — bucură-te de fiecare moment.',
    ],
    night: [
      'Noapte bună! Noaptea de vară, cu stelele ei strălucitoare, îți urează vise plăcute.',
      'Noapte bună! Lasă briza caldă de vară să îți aducă somn liniștit și odihnitor.',
      'Noapte bună! Sub cerul înstelat al verii, îți dorim odihnă deplină și vise frumoase.',
    ],
  },
  autumn: {
    morning: [
      'Bună dimineața! Toamna îți pictează ziua în culori de aur și rugină — dimineață minunată!',
      'Bună dimineața! Aerul proaspăt de toamnă îți aduce energie pentru o zi productivă și frumoasă.',
      'Bună dimineața! Toamna și-a desfășurat covorul de frunze aurii — zi cu spor și bucurie!',
    ],
    afternoon: [
      'Bună ziua! Culorile toamnei fac această după-amiază cu totul specială și memorabilă.',
      'Bună ziua! O plimbare printre frunzele aurii de toamnă îți poate aduce multă bucurie astăzi.',
      'Bună ziua! Toamna îmbracă lumea în culori calde — sperăm că și ziua ta este la fel de colorată.',
    ],
    evening: [
      'Bună seara! Toamna aduce seri liniștite și contemplative — seară plăcută!',
      'Bună seara! Fie ca seara de toamnă să îți aducă confort și pace sufletească.',
      'Bună seara! O seară de toamnă cu o ceașcă caldă și momente dragi — exact ce trebuie.',
    ],
    night: [
      'Noapte bună! Nopțile răcoroase de toamnă sunt perfecte pentru un somn odihnitor — noapte bună!',
      'Noapte bună! Lasă-te legănat de liniștea nopții de toamnă spre vise frumoase și odihnitoare.',
      'Noapte bună! Toamna aduce nopți lungi și liniștite — odihnă binecuvântată!',
    ],
  },
  winter: {
    morning: [
      'Bună dimineața! Iarna și-a pus mantia albă — un ceai cald și o zi frumoasă îți dorim!',
      'Bună dimineața! Frigul iernii nu poate înghița căldura cu care îți dorim o zi minunată!',
      'Bună dimineața! Cristalele de gheață ale iernii strălucesc — zi luminoasă și plină de bucurie!',
    ],
    afternoon: [
      'Bună ziua! Fie ca lumina zilei de iarnă să îți aducă bucurie și căldură sufletească.',
      'Bună ziua! Îți dorim o după-amiază de iarnă confortabilă, plină de căldură și momente dragi.',
      'Bună ziua! Iarna aduce cu ea liniște și frumusețe aparte — după-amiază plăcută!',
    ],
    evening: [
      'Bună seara! Seara de iarnă este perfectă pentru momente calde alături de cei dragi.',
      'Bună seara! Focul și liniștea unei seri de iarnă îți urează o seară de neuitat.',
      'Bună seara! Fie ca seara aceasta de iarnă să îți aducă căldură, voie bună și tihnă.',
    ],
    night: [
      'Noapte bună! Nopțile lungi de iarnă sunt perfecte pentru odihnă adâncă — somn ușor!',
      'Noapte bună! Iarna acoperă totul în liniște — vise frumoase și odihnă binecuvântată!',
      'Noapte bună! Sub plapuma albă a iernii, îți dorim un somn liniștit și vise calde.',
    ],
  },
};

export const OCCASION_MESSAGES: Record<string, string[]> = {
  new_year: [
    'La Mulți Ani! Fie ca noul an să îți aducă sănătate, fericire și împliniri.',
    'La Mulți Ani! Un nou an, noi speranțe și noi bucurii!',
  ],
  union_day: [
    'La Mulți Ani de Ziua Unirii Principatelor! Trăiască România unită!',
    'Să celebrăm împreună Ziua Unirii cu mândrie și recunoștință.',
  ],
  easter: [
    'Hristos a Înviat! Îți dorim o Sfântă Sărbătoare de Paști plină de lumină și bucurie.',
    'La Mulți Ani de Sfintele Paști! Fie ca învierea să aducă pace și bucurie în casa ta.',
  ],
  labour_day: [
    'La Mulți Ani de 1 Mai! Îți dorim o zi binemeritată de odihnă și relaxare.',
    '1 Mai Fericit! Fie ca munca ta să fie mereu răsplătită și apreciată.',
  ],
  childrens_day: [
    'La Mulți Ani de Ziua Copilului! Să păstrăm cu toții puritatea și bucuria copilăriei.',
    'Îți urăm o zi specială de 1 Iunie! Fie ca bucuria copilăriei să rămână mereu în sufletul tău.',
  ],
  assumption: [
    'La Mulți Ani de Sfânta Maria Mare! Pace și binecuvântare în casa ta.',
    'Îți urăm o zi sfântă de Adormirea Maicii Domnului, plină de recunoștință și credință.',
  ],
  saint_andrew: [
    'La Mulți Ani de Sfântul Andrei, ocrotitorul României!',
    'La Mulți Ani tuturor celor ce poartă numele Andrei!',
  ],
  national_day: [
    'La Mulți Ani de Ziua Națională a României! Trăiască România!',
    '1 Decembrie Fericit! Să celebrăm cu mândrie ziua națională a țării noastre.',
  ],
  saint_nicholas: [
    'La Mulți Ani de Sfântul Nicolae! Fie ca Moș Nicolae să îți aducă numai daruri frumoase.',
  ],
  christmas: [
    'Crăciun Fericit! Fie ca Nașterea Mântuitorului să aducă pace și lumină în sufletul tău.',
    'Sărbători Fericite! Să petreci alături de cei dragi momente pline de căldură și bucurie.',
  ],
};

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/1200`;

export const SEASON_TIME_IMAGE_URLS: Record<
  Season,
  Record<TimeOfDay, string[]>
> = {
  spring: {
    morning: [
      img('blossom-sunrise'),
      img('meadow-dawn'),
      img('dew-flowers'),
      img('sunrise-petals'),
      img('spring-birch-morning'),
    ],
    afternoon: [
      img('spring-garden'),
      img('cherry-blossom'),
      img('flowers-blue-sky'),
      img('wildflowers-field'),
      img('spring-butterfly'),
    ],
    evening: [
      img('spring-sunset'),
      img('park-dusk'),
      img('tulips-evening'),
      img('lavender-sunset'),
      img('spring-dusk-pond'),
    ],
    night: [
      img('moonlit-garden'),
      img('night-blossoms'),
      img('stars-spring'),
      img('firefly-spring-night'),
      img('spring-crescent-moon'),
    ],
  },
  summer: {
    morning: [
      img('beach-sunrise'),
      img('summer-dawn'),
      img('golden-morning-sea'),
      img('sunrise-ocean'),
      img('summer-morning-mist'),
    ],
    afternoon: [
      img('sunny-beach'),
      img('summer-field'),
      img('blue-sea'),
      img('sunflower-field'),
      img('summer-pool'),
    ],
    evening: [
      img('beach-sunset'),
      img('summer-golden-hour'),
      img('sea-dusk'),
      img('tropical-sunset'),
      img('summer-evening-palms'),
    ],
    night: [
      img('summer-stars'),
      img('fireflies-night'),
      img('moonlit-sea'),
      img('milky-way-summer'),
      img('night-ocean-stars'),
    ],
  },
  autumn: {
    morning: [
      img('misty-autumn-forest'),
      img('autumn-dawn'),
      img('foggy-leaves'),
      img('autumn-mist-river'),
      img('fall-morning-light'),
    ],
    afternoon: [
      img('autumn-leaves'),
      img('golden-forest'),
      img('red-autumn-path'),
      img('maple-leaves-sun'),
      img('autumn-vineyard'),
    ],
    evening: [
      img('autumn-sunset'),
      img('orange-sky-trees'),
      img('cozy-autumn-dusk'),
      img('autumn-bonfire-dusk'),
      img('fall-evening-fog'),
    ],
    night: [
      img('harvest-moon'),
      img('dark-autumn-forest'),
      img('starry-autumn'),
      img('autumn-full-moon'),
      img('fall-night-lanterns'),
    ],
  },
  winter: {
    morning: [
      img('snowy-dawn'),
      img('frost-morning'),
      img('winter-sunrise'),
      img('blizzard-morning'),
      img('ice-crystals-dawn'),
    ],
    afternoon: [
      img('snowy-landscape'),
      img('winter-village'),
      img('snow-field'),
      img('frozen-lake'),
      img('winter-pine-forest'),
    ],
    evening: [
      img('cozy-fireplace'),
      img('candles-snow-window'),
      img('winter-dusk'),
      img('aurora-winter-eve'),
      img('snow-cabin-dusk'),
    ],
    night: [
      img('winter-stars'),
      img('moonlit-snow'),
      img('snow-night-forest'),
      img('northern-lights'),
      img('winter-full-moon'),
    ],
  },
};

export const OCCASION_IMAGE_URLS: OccasionImageMap = {
  new_year: {
    morning: [
      img('fireworks-dawn'),
      img('new-year-sunrise'),
      img('sparklers-morning'),
      img('new-year-morning-city'),
      img('champagne-sunrise'),
    ],
    afternoon: [
      img('new-year-celebration'),
      img('confetti-day'),
      img('champagne-day'),
      img('balloon-release-day'),
      img('new-year-parade'),
    ],
    evening: [
      img('fireworks'),
      img('sparklers'),
      img('new-year-city-lights'),
      img('new-year-lights-bridge'),
      img('fireworks-crowd'),
    ],
    night: [
      img('midnight-fireworks'),
      img('new-year-night'),
      img('countdown-night'),
      img('new-year-midnight-sky'),
      img('glitter-night'),
    ],
  },
  union_day: {
    morning: [
      img('romania-flag-sunrise'),
      img('tricolor-dawn'),
      img('union-morning'),
      img('alba-iulia-sunrise'),
      img('romanian-countryside-dawn'),
    ],
    afternoon: [
      img('romania-flag'),
      img('tricolor'),
      img('unity-monument'),
      img('alba-iulia'),
      img('tricolor-parade'),
    ],
    evening: [
      img('tricolor-sunset'),
      img('flag-dusk'),
      img('union-evening'),
      img('romania-sunset-mountains'),
      img('union-ceremony-dusk'),
    ],
    night: [
      img('tricolor-night'),
      img('monument-night'),
      img('union-night-lights'),
      img('romania-night-city'),
      img('tricolor-fireworks-night'),
    ],
  },
  easter: {
    morning: [
      img('easter-sunrise'),
      img('spring-church-dawn'),
      img('easter-eggs-morning'),
      img('easter-lily-sunrise'),
      img('church-bells-dawn'),
    ],
    afternoon: [
      img('easter-eggs'),
      img('spring-church'),
      img('white-lilies'),
      img('easter-basket'),
      img('painted-eggs-table'),
    ],
    evening: [
      img('church-candles-evening'),
      img('easter-sunset'),
      img('lilies-dusk'),
      img('orthodox-procession-dusk'),
      img('easter-glow-evening'),
    ],
    night: [
      img('candlelight-easter'),
      img('orthodox-night-service'),
      img('easter-candles'),
      img('church-midnight-service'),
      img('resurrection-candles-night'),
    ],
  },
  labour_day: {
    morning: [
      img('sunny-meadow-dawn'),
      img('spring-morning-park'),
      img('may-day-sunrise'),
      img('may-sunrise-park'),
      img('first-may-flowers-dawn'),
    ],
    afternoon: [
      img('sunny-meadow'),
      img('spring-picnic'),
      img('green-park'),
      img('spring-festival-day'),
      img('outdoor-barbecue'),
    ],
    evening: [
      img('park-sunset'),
      img('picnic-dusk'),
      img('meadow-evening'),
      img('park-gathering-dusk'),
      img('may-day-lights-evening'),
    ],
    night: [
      img('park-night'),
      img('spring-night-lights'),
      img('may-night'),
      img('may-night-city'),
      img('spring-festival-night'),
    ],
  },
  childrens_day: {
    morning: [
      img('playground-morning'),
      img('balloons-sunrise'),
      img('children-dawn'),
      img('kids-running-sunrise'),
      img('colorful-kites-morning'),
    ],
    afternoon: [
      img('playground'),
      img('colorful-balloons'),
      img('children-park'),
      img('carousel-afternoon'),
      img('ice-cream-park'),
    ],
    evening: [
      img('playground-sunset'),
      img('balloons-dusk'),
      img('children-evening'),
      img('fireworks-kids-dusk'),
      img('playground-golden-hour'),
    ],
    night: [
      img('night-fairground'),
      img('children-night-lights'),
      img('stars-children'),
      img('fairground-lights'),
      img('childrens-night-parade'),
    ],
  },
  assumption: {
    morning: [
      img('church-morning'),
      img('marigolds-sunrise'),
      img('assumption-dawn'),
      img('marigold-church-sunrise'),
      img('pilgrimage-dawn'),
    ],
    afternoon: [
      img('orthodox-church'),
      img('marigolds'),
      img('church-candles'),
      img('monastery-garden'),
      img('sunflowers-church'),
    ],
    evening: [
      img('church-sunset'),
      img('candles-dusk'),
      img('marigolds-evening'),
      img('monastery-candles-dusk'),
      img('marigold-sunset'),
    ],
    night: [
      img('church-candles-night'),
      img('orthodox-night'),
      img('candles-dark'),
      img('vigil-candles-night'),
      img('monastery-moonlit'),
    ],
  },
  saint_andrew: {
    morning: [
      img('autumn-monastery-dawn'),
      img('november-frost-morning'),
      img('mist-forest-morning'),
      img('garlic-wreath-dawn'),
      img('wolf-frost-morning'),
    ],
    afternoon: [
      img('autumn-monastery'),
      img('wolf-forest'),
      img('november-mist'),
      img('danube-delta-afternoon'),
      img('cave-saint-andrew'),
    ],
    evening: [
      img('monastery-sunset'),
      img('dark-forest-dusk'),
      img('november-evening'),
      img('october-mist-evening'),
      img('wolf-tracks-dusk'),
    ],
    night: [
      img('monastery-night'),
      img('forest-night-mist'),
      img('saint-andrew-night'),
      img('full-moon-wolves'),
      img('november-starry-forest'),
    ],
  },
  national_day: {
    morning: [
      img('winter-flag-sunrise'),
      img('snowy-dawn-flag'),
      img('december-morning'),
      img('carpathian-sunrise'),
      img('romania-dawn-village'),
    ],
    afternoon: [
      img('winter-flag'),
      img('snow-mountains'),
      img('december-village'),
      img('military-parade'),
      img('tricolor-sky'),
    ],
    evening: [
      img('flag-winter-sunset'),
      img('mountain-dusk-snow'),
      img('december-evening'),
      img('bucharest-lights-dusk'),
      img('december-ceremony-evening'),
    ],
    night: [
      img('winter-flag-night'),
      img('snowy-village-night'),
      img('december-night-lights'),
      img('bucharest-night-lights'),
      img('national-day-fireworks'),
    ],
  },
  saint_nicholas: {
    morning: [
      img('snow-gifts-morning'),
      img('winter-boots-sunrise'),
      img('nicholas-dawn'),
      img('christmas-boot-morning'),
      img('gift-sack-dawn'),
    ],
    afternoon: [
      img('snow-gifts'),
      img('winter-boots-snow'),
      img('snowy-afternoon'),
      img('toy-shop-snow'),
      img('children-gifts-day'),
    ],
    evening: [
      img('gifts-candlelight'),
      img('snowy-evening-boots'),
      img('nicholas-dusk'),
      img('candle-gifts-evening'),
      img('snow-lantern-dusk'),
    ],
    night: [
      img('snowy-night'),
      img('gifts-by-firelight'),
      img('nicholas-night'),
      img('gift-tree-night'),
      img('nicholas-starry-night'),
    ],
  },
  christmas: {
    morning: [
      img('christmas-tree-sunrise'),
      img('snow-lights-morning'),
      img('christmas-dawn'),
      img('nativity-sunrise'),
      img('carol-singers-dawn'),
    ],
    afternoon: [
      img('christmas-tree'),
      img('snow-lights'),
      img('winter-village-christmas'),
      img('christmas-market'),
      img('gifts-under-tree'),
    ],
    evening: [
      img('christmas-candles-evening'),
      img('snow-lights-dusk'),
      img('christmas-glow'),
      img('christmas-fireplace'),
      img('snow-village-lights'),
    ],
    night: [
      img('winter-candles'),
      img('christmas-night-lights'),
      img('christmas-starry-night'),
      img('christmas-stars-night'),
      img('silent-night-snow'),
    ],
  },
};
