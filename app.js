const TAROLO_TEMA = 'memoria.tema';
const TAROLO_LEGJOBB = 'memoria.legjobb.';
const VISSZAFORDULAS_MS = 900;
const ALAPTEMA = 'csontok';

const elemek = {
  tabla: document.querySelector('#tabla'),
  tema: document.querySelector('#tema'),
  ujra: document.querySelector('#ujra'),
  lepes: document.querySelector('#lepes'),
  ido: document.querySelector('#ido'),
  legjobb: document.querySelector('#legjobb'),
  gyozelem: document.querySelector('#gyozelem'),
  gyozelemAdat: document.querySelector('#gyozelem-adat'),
  gyozelemRekord: document.querySelector('#gyozelem-rekord'),
  gyozelemUjra: document.querySelector('#gyozelem-ujra'),
  hirado: document.querySelector('#hirado')
};

const allapot = {
  tema: ALAPTEMA,
  elso: null,
  masodik: null,
  zarolva: false,
  lepes: 0,
  talalat: 0,
  osszes: 0,
  kezdes: null,
  vege: false,
  visszaIdozito: null,
  oraIdozito: null
};

function kever(t) {
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

function formazIdo(masodperc) {
  const perc = Math.floor(masodperc / 60);
  const mp = String(masodperc % 60).padStart(2, '0');
  return `${perc}:${mp}`;
}

function formazEredmeny(eredmeny) {
  return `${eredmeny.lepes} lépés, ${formazIdo(eredmeny.ido)}`;
}

function mentettTema() {
  try {
    const tema = localStorage.getItem(TAROLO_TEMA);
    return tema && TEMAK[tema] ? tema : ALAPTEMA;
  } catch {
    return ALAPTEMA;
  }
}

function temaMentese(tema) {
  try {
    localStorage.setItem(TAROLO_TEMA, tema);
  } catch {}
}

function legjobbOlvasas(tema) {
  try {
    const nyers = localStorage.getItem(TAROLO_LEGJOBB + tema);
    if (!nyers) return null;
    const adat = JSON.parse(nyers);
    if (Number.isFinite(adat.lepes) && Number.isFinite(adat.ido)) return adat;
    return null;
  } catch {
    return null;
  }
}

function legjobbIras(tema, eredmeny) {
  try {
    localStorage.setItem(TAROLO_LEGJOBB + tema, JSON.stringify(eredmeny));
  } catch {}
}

function jobbMint(uj, regi) {
  if (!regi) return true;
  if (uj.lepes !== regi.lepes) return uj.lepes < regi.lepes;
  return uj.ido < regi.ido;
}

function legjobbKiiras() {
  const eredmeny = legjobbOlvasas(allapot.tema);
  elemek.legjobb.textContent = eredmeny ? formazEredmeny(eredmeny) : 'Még nincs';
}

function kartyakKeszitese(tema) {
  const lista = [];
  TEMAK[tema].parok.forEach(([magyar, latin], par) => {
    lista.push({ par, nyelv: 'magyar', szoveg: magyar });
    lista.push({ par, nyelv: 'latin', szoveg: latin });
  });
  return kever(lista);
}

function lefedettCimke(k) {
  return `Lefordított kártya, ${k.dataset.sorszam}. a ${allapot.osszes} közül`;
}

function felforditottCimke(k) {
  const nyelv = k.dataset.nyelv === 'latin' ? 'Latin' : 'Magyar';
  return `${nyelv}: ${k.dataset.szoveg}`;
}

function reszElem(cimke, osztaly, szoveg) {
  const elem = document.createElement(cimke);
  elem.className = osztaly;
  if (szoveg !== undefined) elem.textContent = szoveg;
  return elem;
}

function kartyaElem(adat, index) {
  const gomb = document.createElement('button');
  gomb.type = 'button';
  gomb.className = 'kartya';
  gomb.dataset.par = adat.par;
  gomb.dataset.nyelv = adat.nyelv;
  gomb.dataset.szoveg = adat.szoveg;
  gomb.dataset.sorszam = index + 1;

  const belso = reszElem('span', 'belso');
  const hat = reszElem('span', 'lap hat');
  const elo = reszElem('span', 'lap elo');
  hat.setAttribute('aria-hidden', 'true');
  elo.setAttribute('aria-hidden', 'true');
  elo.append(reszElem('span', 'nyelv', adat.nyelv), reszElem('span', 'szoveg', adat.szoveg));
  belso.append(hat, elo);
  gomb.append(belso);
  gomb.setAttribute('aria-label', lefedettCimke(gomb));
  return gomb;
}

function felfordit(k) {
  k.classList.add('felforditva');
  k.setAttribute('aria-label', felforditottCimke(k));
}

function visszafordit(k) {
  k.classList.remove('felforditva', 'hibas');
  k.setAttribute('aria-label', lefedettCimke(k));
}

function megtalaltnakJelol(k) {
  k.classList.add('megtalalt');
  k.setAttribute('aria-disabled', 'true');
  k.setAttribute('aria-label', `Megtalált pár, ${felforditottCimke(k)}`);
}

function bejelent(szoveg) {
  elemek.hirado.textContent = szoveg;
}

function eltelt() {
  if (!allapot.kezdes) return 0;
  return Math.floor((Date.now() - allapot.kezdes) / 1000);
}

function idoFrissitese() {
  elemek.ido.textContent = formazIdo(eltelt());
}

function oraInditasa() {
  allapot.kezdes = Date.now();
  allapot.oraIdozito = setInterval(idoFrissitese, 250);
}

function oraLeallitasa() {
  clearInterval(allapot.oraIdozito);
  allapot.oraIdozito = null;
}

function parNullazas() {
  allapot.elso = null;
  allapot.masodik = null;
}

function gyozelem() {
  allapot.vege = true;
  oraLeallitasa();
  const eredmeny = { lepes: allapot.lepes, ido: eltelt() };
  elemek.ido.textContent = formazIdo(eredmeny.ido);

  const rekord = jobbMint(eredmeny, legjobbOlvasas(allapot.tema));
  if (rekord) legjobbIras(allapot.tema, eredmeny);
  legjobbKiiras();

  elemek.gyozelemAdat.textContent =
    `Mind a ${allapot.osszes / 2} pár megvan: ${formazEredmeny(eredmeny)}.`;
  elemek.gyozelemRekord.textContent = rekord
    ? 'Ez a témád eddigi legjobb eredménye.'
    : 'A legjobb eredményedet most nem sikerült megdönteni.';
  elemek.gyozelem.hidden = false;
  elemek.gyozelem.focus();
}

function kattintas(e) {
  const k = e.target.closest('button.kartya');
  if (!k || !elemek.tabla.contains(k)) return;
  if (allapot.zarolva || allapot.vege) return;
  if (k.classList.contains('felforditva')) return;

  if (!allapot.kezdes) oraInditasa();
  felfordit(k);

  if (!allapot.elso) {
    allapot.elso = k;
    bejelent(felforditottCimke(k));
    return;
  }

  allapot.masodik = k;
  allapot.lepes += 1;
  elemek.lepes.textContent = allapot.lepes;

  const elso = allapot.elso;
  const masodik = allapot.masodik;

  if (elso.dataset.par === masodik.dataset.par) {
    megtalaltnakJelol(elso);
    megtalaltnakJelol(masodik);
    parNullazas();
    allapot.talalat += 1;
    bejelent(`Pár megtalálva: ${elso.dataset.szoveg} és ${masodik.dataset.szoveg}`);
    if (allapot.talalat === allapot.osszes / 2) gyozelem();
    return;
  }

  allapot.zarolva = true;
  elso.classList.add('hibas');
  masodik.classList.add('hibas');
  bejelent(`${felforditottCimke(masodik)}. Nem egyezik.`);
  allapot.visszaIdozito = setTimeout(() => {
    visszafordit(elso);
    visszafordit(masodik);
    parNullazas();
    allapot.zarolva = false;
    allapot.visszaIdozito = null;
  }, VISSZAFORDULAS_MS);
}

function ujJatek() {
  clearTimeout(allapot.visszaIdozito);
  oraLeallitasa();

  Object.assign(allapot, {
    elso: null,
    masodik: null,
    zarolva: false,
    lepes: 0,
    talalat: 0,
    kezdes: null,
    vege: false,
    visszaIdozito: null
  });

  const lista = kartyakKeszitese(allapot.tema);
  allapot.osszes = lista.length;
  elemek.tabla.replaceChildren(...lista.map(kartyaElem));

  elemek.lepes.textContent = '0';
  elemek.ido.textContent = '0:00';
  elemek.gyozelem.hidden = true;
  legjobbKiiras();
  bejelent('Új játék indult, a kártyák megkeverve.');
}

function temaValasztok() {
  Object.entries(TEMAK).forEach(([kulcs, tema]) => {
    const opcio = document.createElement('option');
    opcio.value = kulcs;
    opcio.textContent = tema.nev;
    elemek.tema.append(opcio);
  });
  elemek.tema.value = allapot.tema;
}

function inditas() {
  allapot.tema = mentettTema();
  temaValasztok();

  elemek.tabla.addEventListener('click', kattintas);
  elemek.ujra.addEventListener('click', ujJatek);
  elemek.gyozelemUjra.addEventListener('click', () => {
    ujJatek();
    elemek.ujra.focus();
  });
  elemek.tema.addEventListener('change', () => {
    allapot.tema = elemek.tema.value;
    temaMentese(allapot.tema);
    ujJatek();
  });

  ujJatek();
}

inditas();