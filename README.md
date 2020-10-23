# jsramverk-project-api

## Val av teknik
- Express  
Jag valde att använda express som HTTP-server, framförallt pågrund av att jag har mest erfarenhet med det. Mitt API är strukuterat med en del middleware och routes: cors, morgan och json body-parser används för cross-origin, loggning och parsing av json. Mina routes är sedan strukturerade under /routes mappen där auth hanterar registrering, inloggning och authentisering med jwt. Det finns en middleware som verifierar jwt för vissa routes (/transaction), /stocks är helt publik och visar priser medans /transaction hanterar alla transaktioner.

- NoSQL - Mongodb  
Som databas använder jag en mongodb databas, förförallt för att dokument-baserade databaser är väldigt flexibelt och dess struktur kan likna JavaScript objekt en del vilket underlättar när man jobbar i JavaScript. Jag har ett script (db/migrate.js) som återställer databasen och db/database.js som hanterar anslutningen till databasen.
