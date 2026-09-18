# app_bc

Guida digitale per una struttura ricettiva: homepage di benvenuto con sezioni (appartamenti, spiagge, ristoranti, cantine e vini, sentieri, escursioni, servizi e supermercati, numeri utili, mappe, assistenza), contenuti gestibili da un pannello di amministrazione.

**Stack**: Next.js (App Router, TypeScript) · PostgreSQL · Prisma ORM · Tailwind CSS · Docker

## Requisiti

- Node.js (LTS)
- Docker Desktop (per PostgreSQL in locale)

## Setup ambiente locale

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Copia `.env.example` in `.env` e personalizza i valori (in particolare `ADMIN_EMAIL`/`ADMIN_PASSWORD`, usati solo per creare il primo account amministratore).

3. Avvia il database PostgreSQL (Docker):

   ```bash
   npm run db:up
   ```

4. Applica le migration al database (crea le tabelle a partire da `prisma/schema.prisma`):

   ```bash
   npm run prisma:migrate
   ```

5. Popola il database con le 10 sezioni, le impostazioni di base del sito e l'account amministratore:

   ```bash
   npm run db:seed
   ```

6. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

   Apri [http://localhost:3000](http://localhost:3000) per il sito pubblico e [http://localhost:3000/admin/login](http://localhost:3000/admin/login) per il pannello di amministrazione (credenziali da `ADMIN_EMAIL`/`ADMIN_PASSWORD`).

## Script disponibili

| Comando                  | Descrizione                                             |
| ------------------------- | -------------------------------------------------------- |
| `npm run dev`              | Avvia il server di sviluppo Next.js                      |
| `npm run build`            | Build di produzione                                       |
| `npm run start`            | Avvia la build di produzione                              |
| `npm run lint`              | Esegue ESLint                                             |
| `npm run db:up`            | Avvia PostgreSQL via Docker Compose                       |
| `npm run db:down`          | Ferma il container PostgreSQL                             |
| `npm run prisma:generate`  | Rigenera il Prisma Client dallo schema                    |
| `npm run prisma:migrate`   | Crea/applica una migration Prisma in sviluppo             |
| `npm run prisma:studio`    | Apre Prisma Studio (GUI per esplorare il database)        |
| `npm run db:seed`          | Crea le 10 sezioni, le impostazioni sito e l'account admin |

## Struttura del progetto

```
prisma/schema.prisma          # Modelli del database
prisma/seed.ts                 # Dati iniziali (sezioni, sito, admin)
src/app/                       # Pagine pubbliche (App Router)
src/app/[categoria]/           # Pagina dinamica di ogni sezione
src/app/assistenza/            # Modulo di contatto
src/app/admin/login/           # Login amministratore (pubblico)
src/app/admin/(protected)/     # Pannello admin (richiede login)
src/app/actions/               # Server Actions (mutazioni dati)
src/lib/                       # Prisma client, sessione, password, upload
src/components/                # Componenti condivisi (UI)
src/proxy.ts                   # Protezione delle rotte /admin
public/uploads/                # Foto caricate dal pannello admin (non versionate)
docker-compose.yml             # Servizio PostgreSQL locale
.env                           # Variabili d'ambiente (non versionato)
```

## Variabili d'ambiente

Vedi `.env.example`. Copia `.env.example` in `.env` e personalizza:

- `DATABASE_URL` — connessione a PostgreSQL
- `SESSION_SECRET` — chiave per firmare la sessione admin (stringa casuale)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credenziali usate dallo script di seed per creare il primo account amministratore

## Gestione contenuti

Tutti i contenuti (testo di benvenuto, contatti, foto ed elementi di ogni sezione) si modificano da `/admin` dopo aver effettuato il login — non serve toccare il codice. Le foto caricate vengono salvate in `public/uploads/`.
