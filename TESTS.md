# Kézi tesztesetek

Minden teszt friss oldalbetöltéssel indul, a böngésző konzolja nyitva van. Az „Eredmény" oszlopot futtatás után kell kitölteni.

Teszt | Lépések | Elvárt eredmény | Eredmény

1. Dupla kattintás ugyanarra a kártyára | Kattints kétszer egymás után ugyanarra a lefordított kártyára. | A kártya felfordítva marad, a lépésszám 0 marad, nem lesz belőle pár.
2. Gyors tripla kattintás | Kattints gyorsan három különböző kártyára, amelyek közül az első kettő nem pár. | Csak az első két kártya fordul fel, a harmadik kattintás hatástalan, a lépésszám 1. A hibás pár 900 ms után visszafordul.
3. Helyes pár | Fordíts fel egy magyar kártyát és a latin párját. | Mindkét kártya felfordítva és zöld háttérrel marad, a lépésszám 1.
4. Hibás pár | Fordíts fel két nem összetartozó kártyát. | Rövid ideig mindkettő látszik piros kerettel, majd visszafordulnak, a lépésszám 1.
5. Megtalált kártya újrakattintása | Találj meg egy párt, majd kattints az egyik tagjára. | Semmi nem változik, a lépésszám nem nő.
6. Újrakezdés játék közben | Fordíts fel két nem egyező kártyát, és még a visszafordulás előtt kattints az Újrakezdés gombra. | Új keverés, 0 lépés, 0:00 idő, minden kártya lefordítva, és a régi időzítő nem fordít vissza semmit az új táblán.
7. Időmérő indulása | Töltsd be az oldalt, várj 5 másodpercet, majd kattints egy kártyára. | Az idő az első kattintásig 0:00, utána indul.
8. Győzelem | Játszd végig a játékot (a kártyák `data-par` attribútuma segíthet a párok megtalálásában). | Az oldalon megjelenik a győzelem üzenet a lépésszámmal és az idővel, `alert` nincs, az óra megáll, a legjobb eredmény frissül.
9. Újrakezdés győzelem után | A győzelem üzenetben kattints az Új játék gombra. | A győzelem üzenet eltűnik, a számlálók nullázódnak, új keverés történik, a legjobb eredmény megmarad.
10. Legjobb eredmény mentése | Játssz le egy játékot, töltsd újra az oldalt. | A legjobb eredmény az újratöltés után is látszik.
11. localStorage törlése után | Töröld a böngésző `localStorage` tartalmát, töltsd újra az oldalt. | A legjobb eredmény helyén „Még nincs" áll, a konzolban nincs hiba, a játék működik.
12. Témaváltás | Válts témát a legördülő listából. | Új, a témához tartozó kártyák jelennek meg, a számlálók nullázódnak, a legjobb eredmény a téma saját értéke. A választás újratöltés után is megmarad.
13. Billentyűzetes játék | Egérhasználat nélkül, Tab és Enter (vagy szóköz) segítésével játssz végig egy játékot. | Minden kártya elérhető és felfordítható, a fókusz látható, a játék végigjátszható.
14. Konzol | Játssz le egy teljes játékot, közben figyeld a konzolt. | Nincs hibaüzenet.