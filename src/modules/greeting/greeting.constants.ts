import {
  Season,
  TimeOfDay,
} from '../../providers/greeting-context/greeting-context.service';

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
    morning: [img('blossom-sunrise'), img('meadow-dawn'), img('dew-flowers')],
    afternoon: [
      img('spring-garden'),
      img('cherry-blossom'),
      img('flowers-blue-sky'),
    ],
    evening: [img('spring-sunset'), img('park-dusk'), img('tulips-evening')],
    night: [img('moonlit-garden'), img('night-blossoms'), img('stars-spring')],
  },
  summer: {
    morning: [
      img('beach-sunrise'),
      img('summer-dawn'),
      img('golden-morning-sea'),
    ],
    afternoon: [img('sunny-beach'), img('summer-field'), img('blue-sea')],
    evening: [img('beach-sunset'), img('summer-golden-hour'), img('sea-dusk')],
    night: [img('summer-stars'), img('fireflies-night'), img('moonlit-sea')],
  },
  autumn: {
    morning: [
      img('misty-autumn-forest'),
      img('autumn-dawn'),
      img('foggy-leaves'),
    ],
    afternoon: [
      img('autumn-leaves'),
      img('golden-forest'),
      img('red-autumn-path'),
    ],
    evening: [
      img('autumn-sunset'),
      img('orange-sky-trees'),
      img('cozy-autumn-dusk'),
    ],
    night: [
      img('harvest-moon'),
      img('dark-autumn-forest'),
      img('starry-autumn'),
    ],
  },
  winter: {
    morning: [img('snowy-dawn'), img('frost-morning'), img('winter-sunrise')],
    afternoon: [
      img('snowy-landscape'),
      img('winter-village'),
      img('snow-field'),
    ],
    evening: [
      img('cozy-fireplace'),
      img('candles-snow-window'),
      img('winter-dusk'),
    ],
    night: [img('winter-stars'), img('moonlit-snow'), img('snow-night-forest')],
  },
};

export const OCCASION_IMAGE_URLS: Record<string, string[]> = {
  new_year: [img('fireworks'), img('sparklers'), img('new-year-celebration')],
  union_day: [img('romania-flag'), img('tricolor'), img('unity-monument')],
  easter: [img('easter-eggs'), img('spring-church'), img('white-lilies')],
  labour_day: [img('sunny-meadow'), img('spring-picnic'), img('green-park')],
  childrens_day: [
    img('playground'),
    img('colorful-balloons'),
    img('children-park'),
  ],
  assumption: [img('church-candles'), img('marigolds'), img('orthodox-church')],
  saint_andrew: [
    img('autumn-monastery'),
    img('wolf-forest'),
    img('november-mist'),
  ],
  national_day: [
    img('winter-flag'),
    img('snow-mountains'),
    img('december-village'),
  ],
  saint_nicholas: [
    img('snow-gifts'),
    img('winter-boots-snow'),
    img('snowy-night'),
  ],
  christmas: [img('christmas-tree'), img('snow-lights'), img('winter-candles')],
};
