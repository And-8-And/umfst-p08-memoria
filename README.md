# Anatómiai memóriajáték

Memóriajáték orvostanhallgatóknak: a magyar anatómiai kifejezéshez kell megtalálni a latin megfelelőjét (például *combcsont* és *femur*). A projekt tisztán HTML, CSS és JavaScript, külső függőség nélkül.

# Élő demó: https://github.com/And-8-And/umfst-p08-memoria

[Egy teljes játékmenet](jatekmenet.gif)

## Játékszabály

1. A tábla 16 lefordított kártyát tartalmaz, 8 magyar–latin párt.
2. Kattints (vagy Tab + Enter) két kártyára, hogy felfordítsd őket.
3. Ha a két kártya egy pár, felfordítva maradnak és megtaláltnak számítanak.
4. Ha nem, rövid idő után (900 ms) visszafordulnak. Ez alatt újabb kártyát nem lehet felfordítani.
5. A játék akkor ér véget, ha mind a 8 pár megvan.

Egy lépés egy kártyapár felfordítása. Az időmérő az első kattintásnál indul. A legjobb eredmény (kevesebb lépés, azonos lépésszámnál rövidebb idő) témánként a böngésző `localStorage`-ában marad meg.

## Funkciók

- Kártyák generálása a `data.js` adataiból, a HTML-ben nincs kézzel írt kártya
- Fisher–Yates keverés
- Egyszerre legfeljebb két felfordított kártya
- Lépésszámláló és időmérő
- Győzelem üzenet az oldalon, `alert` nélkül
- Újrakezdés gomb, amely új keveréssel nulláz minden számlálót
- Három téma: csontok, izmok, gyógyszercsoportok
- CSS 3D kártyafelfordítás (a `prefers-reduced-motion` beállítást figyelembe veszi)
- Billentyűzettel végigjátszható, a képernyőolvasó számára állapotközlés (`aria-live`, `aria-label`)

## Állapotok

### A játék állapota (`allapot` objektum az `app.js`-ben)

Mező | Jelentés

`tema` | a kiválasztott téma kulcsa
`elso` | az első felfordított kártya, vagy `null`
`masodik` | a második felfordított kártya, vagy `null`
`zarolva` | `true`, amíg egy hibás pár visszafordulására várunk
`lepes` | a megtett lépések száma
`talalat` | a megtalált párok száma
`osszes` | a kártyák száma
`kezdes` | az első kattintás időpontja, addig `null`
`vege` | `true`, ha a játék véget ért
`visszaIdozito`, `oraIdozito` | a futó időzítők azonosítói

### Egy kártya állapota

Állapot | CSS osztály | Leírás

lefordított | nincs | a kártya háta látszik, kattintható
felfordított | `felforditva` | az eleje látszik, további kattintás nem számít
hibás pár | `felforditva hibas` | a két kártya nem egyezik, a lezárás alatt látszanak
megtalált | `felforditva megtalalt` | a pár végleg felfordítva marad, `aria-disabled="true"`

### Kattintás menete

1. Ha a tábla zárolt, a játék véget ért, vagy a kártya már fel van fordítva, a kattintás figyelmen kívül marad.
2. Az első kattintás elindítja az órát, felfordítja a kártyát és eltárolja `elso`-ként.
3. A második kattintás `masodik`-ként tárolja a kártyát és növeli a lépésszámot.
4. Egyezésnél mindkét kártya megtalált lesz, az utolsó pár után jön a győzelem.
5. Eltérésnél `zarolva = true`, 900 ms múlva a két kártya visszafordul, és a zárolás megszűnik.

Az újrakezdés a függőben lévő visszafordító időzítőt is törli, ezért játék közbeni újrakezdés után sem fordul vissza kártya a régi táblából.

## Fájlok

Fájl | Tartalom

`index.html` | az oldal szerkezete
`style.css` | megjelenés és a kártyafelfordítás
`app.js` | játéklogika, állapotkezelés, eseménydelegálás
`data.js` | a témák és a párok
`TESTS.md` | kézi tesztesetek

## Futtatás

Nincs szükség buildre. Elég az `index.html` megnyitása a böngészőben, vagy egy egyszerű szerver.

## Új téma hozzáadása

A `data.js` `TEMAK` objektumába új kulcs kerül `nev` és pontosan 8 elemű `parok` tömbbel. A témaválasztó automatikusan kiegészül vele.