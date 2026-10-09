# Contesto del progetto

## Identita e obiettivo

Questo repository pubblica mappe concettuali interattive e materiali di studio originali per il manuale **Nuovo Gestione e valorizzazione agroterritoriale**.

Lo scopo e offrire a studenti un sito consultabile gratuitamente da telefono, tablet e computer. Le mappe devono essere chiare, espandibili con un clic e organizzate per capitolo e sottocapitolo.

## Vincoli sui contenuti

- Pubblicare soltanto sintesi, spiegazioni, schemi e grafici originali.
- Non includere scansioni, fotografie delle pagine, PDF del libro o trascrizioni estese del manuale.
- Usare il titolo del manuale solo per identificare la raccolta.
- Quando un dato e tecnico o aggiornabile, verificare fonti affidabili prima di inserirlo.

## Stato attuale

- Sito pubblico: `https://ksanta-bit.github.io/nuovo-gestione-e-valorizzazione-agroterritoriale/`
- Repository: `https://github.com/ksanta-bit/nuovo-gestione-e-valorizzazione-agroterritoriale`
- Capitolo disponibile: **Capitolo 7 - Agricoltura, aree montane e boschive**.
- Sottocapitoli disponibili: 7.1, 7.2.1, 7.2.2, 7.3, 7.4 e 7.5.

## Struttura dei file

```text
index.html                    Indice generale del libro
capitolo-07/
  indice_capitolo_07.html     Indice del Capitolo 7
  07_*.html                   Una mappa per sottocapitolo
  stile_mappe_capitolo_7.css  Stile condiviso delle mappe semplici
STILE_MAPPE.md                Regole da replicare nei capitoli futuri
```

## Regole per le nuove mappe

- Usare nel nome file il numero e il titolo del sottocapitolo, ad esempio `08_01_titolo.html`.
- Inserire sempre i collegamenti a `Indice del libro` e `Indice del capitolo` all'inizio della pagina.
- La mappa deve avere un concetto centrale e rami principali espandibili.
- Ogni ramo principale deve avere un numero sequenziale a due cifre (`01`, `02`, `03`) in un riquadro compatto colorato, separato dal titolo.
- Spiegare i punti finali con frasi brevi ma complete: definizione, causa-effetto, esempio o conseguenza pratica quando utile.
- Aggiungere immagini o schemi solo quando chiariscono davvero un concetto e quando si dispone del diritto di pubblicarli.

## Responsivita e leggibilita

- Desktop: massimo tre riquadri per riga e testo base da 24 px.
- Tablet: due riquadri per riga e testo base da 20 px.
- Telefono: un riquadro per riga e testo base da 18 px.
- La pagina deve usare quasi tutta la larghezza disponibile, con margini proporzionati.
- Non comprimere mai cinque o piu riquadri nella stessa riga solo per sfruttare lo spazio: la leggibilita viene prima della densita.

## Stampa

Ogni mappa deve includere regole `@media print` con:

- fondo bianco;
- testo scuro e bordi sobri;
- nessuna ombra o decorazione superflua;
- tutti i contenuti espandibili visibili;
- pulsanti e navigazione nascosti.

## Pubblicazione

Il sito e pubblicato con GitHub Pages dalla branch `main`. Dopo ogni modifica:

```bash
git add .
git commit -m "Descrizione della modifica"
git push
```

GitHub Pages rigenera automaticamente il sito. Verificare il link pubblico dopo la build.
