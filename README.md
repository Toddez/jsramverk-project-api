# jsramverk-project-api

[![Build Status](https://scrutinizer-ci.com/g/Toddez/jsramverk-project-api/badges/build.png?b=main)](https://scrutinizer-ci.com/g/Toddez/jsramverk-project-api/build-status/main)
[![Code Coverage](https://scrutinizer-ci.com/g/Toddez/jsramverk-project-api/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/Toddez/jsramverk-project-api/?branch=main)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Toddez/jsramverk-project-api/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/Toddez/jsramverk-project-api/?branch=main)

## Installation
Installera `mongodb` server lokalt.

``npm install``  
Installerar samtliga moduler.

``npm run migrate``  
Återställer databasen och sätter default-värden.

## Körning
``npm start``  
Startar en development server på port 1337.

``npm test``  
Kör tester.

## Val av teknik
- Express  
Jag valde att använda express som HTTP-server, framförallt pågrund av att jag har mest erfarenhet med det. Mitt API är strukuterat med en del middleware och routes: cors, morgan och json body-parser används för cross-origin, loggning och parsing av json. Mina routes är sedan strukturerade under /routes mappen där auth hanterar registrering, inloggning och authentisering med jwt. Det finns en middleware som verifierar jwt för vissa routes (/transaction), /stocks är helt publik och visar priser medans /transaction hanterar alla transaktioner.

- NoSQL - Mongodb  
Som databas använder jag en mongodb databas, förförallt för att dokument-baserade databaser är väldigt flexibelt och dess struktur kan likna JavaScript objekt en del vilket underlättar när man jobbar i JavaScript. Jag har ett script (db/migrate.js) som återställer databasen och db/database.js som hanterar anslutningen till databasen.

## Tester
### Testsuite
Jag använder paketen: nyc, mocha och chai för test av mitt API. Testerna täcker samtliga routes, och det fungerar väldigt bra. Det var väldigt lätt att skriva tester trots att jag hade ett antal tester som krävde t.ex. ett visst id eller inloggning, men det gick att lösa rätt så lätt genom att kedja tester som först loggar in användaren och sparar dess token. Det var även lätt att få bra kodtäckning då jag endast behövde skriva test för varje route och fick då rätt så bra kodtäckning.

### CI-kedja
Jag använder endast scrutinizer-ci som CI-kedja då den gör allt som behövs (byggtjänst, kodtäckning och kodkvalitet). Det är rätt så smidigt att ha tester som körs automatiskt i en isolerad miljö då man vet exakt vad det är som orsakar att ett test misslyckas. Jag är väldigt nöjd med scrutinizer då det var väldigt lätt att sätta upp mina tester med code coverage och sedan att configurera tester för kodkvalitet. Eftersom mitt API använder mongodb fick jag även lägga till det som service, men det var lätt gjort. Det enda som är lite skumt med scrutinizer är dess kodkvalitets test då den verkar inte ge betyg baserat på alla filer. Den ger endast betyg på 2/3 routes.
