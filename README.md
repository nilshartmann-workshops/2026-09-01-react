# React Workshop

Dieses Repository enthält unseren Workspace, in dem wir während der React Schulung Übungen machen.

> [!IMPORTANT]  
> Bitte führe die Installationsanleitung unbedingt **einige Tage vor** dem Workshop aus, damit wir sicher sind,
> dass es keine (unlösbaren) technischen Probleme während der Schulung gibt.

# Technische Voraussetzungen

Für den Workshop brauchst du:

- **einen Editor oder eine IDE**
  - wenn du bei der Arbeit bereits eine IDE verwendest, die JavaScript- und TypeScript-Support bietet, kannst du diese auch im Workshop verwenden
    - abgesehen von JavaScript/TypeScript-Unterstützung gibt es keine weiteren Anforderungen an IDE/Editor
    - ich würde nicht empfehlen, während der Schulung eine für dich neue IDE bzw. einen neuen Editor auszuprobieren. Nimm lieber die Tools, die du kennst, vorausgesetzt, sie bieten JavaScript- und TypeScript-Support.
  - bei JetBrains-IDEs (IntelliJ oder Webstorm) bitte darauf achten, dass du eine **Version von mindestens 2025** verwendest (sonst funktioniert TypeScript nicht richtig)
  - in jedem Fall empfehle ich, in der IDE die **KI-Unterstützung auszuschalten** (Copilot, AI Assistant, etc.).
    - bei einer Schulung sind die Vorschläge meistens eher irritierend denn hilfreich
    - außerdem ist der Sinn der Schulung ja gerade, dass wir Code selbst schreiben, um zu lernen, und uns den Code nicht schreiben lassen...
- **Node.js (mind. Version 24.x)**
  - wir benötigen mindestens die **Node.js-Version 24.x**. Das ist die aktuelle "long-term support" (LTS) Version von Node.js (also die aktuelle "stabile" Version).
    - Node.js kannst du hier für alle Betriebssystem runterladen und installieren: https://nodejs.org/en/download
    - Wenn Node.js bei dir installiert ist, kannst du mit `node -v` die Version ausgeben und überprüfen
  - enthalten in der Node.js-Installation ist der Node Package Manager (**npm**), den wir zur Installation der JavaScript Packages verwenden
    - Auch hier kannst du die installierte Version überprüfen: `npm -v` (bei mir zzt. 11.x)
- **einen Git-Client**
  - damit du das Repository klonen kannst
- **einen Webbrowser**
- **Internetzugang und Berechtigungen**
  - Du musst auf deinem Computer mit npm Pakete installieren können (dürfen)
  - Du musst dieses Git Repository klonen können (dürfen)
  - Du musst auf deinem Computer Node.js ausführen können (dürfen)
  - Wenn du an der Schulung nicht in deiner "gewohnten" Umgebung teilnimmst, denk dran, zu prüfen, ob es **Einschränkungen bzgl. VPN, Firewall etc.** gibt
- **Weitere Informationen**
  - siehe Dokument [Vorbereitung auf das React-Seminar](https://gist.github.com/nilshartmann/6a581328d48540f2663541df9b3eca94)

## Extensions und Dev Tools

Die folgenden Tools sind nicht notwendig für den Workshop, können aber ganz hilfreich sein.

**React Dev Tools**

Links zum Installieren der React Developer Tools findest du auf dieser Seite in der React-Dokumentation: https://react.dev/learn/react-developer-tools

**GraphQL Tooling**

Später im Workshop arbeiten wir mit GraphQL.

1.  GraphQL-Plug-in für deine IDE. Es gibt dir Code-Completion und Syntax Highlighting für GraphQL-Abfragen im Source-Code.
  - IntelliJ/WebStorm: https://plugins.jetbrains.com/plugin/8097-graphql
  - VS Code: https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql

2. Apollo Client DevTools für Chrome oder Firefox: https://www.apollographql.com/docs/react/development-testing/developer-tooling#apollo-client-devtools

# Installation des Workspaces

## Repository-Struktur

Nach dem Klonen des Repositories (s.u.) findest du zwei Verzeichnisse in dem geklonten Repository:

- `backend`: eine kleine, in Node.js geschriebene Anwendung, die das Backend für unsere Anwendung als GraphQL-API zur Verfügung stellt. In diesem Verzeichnis machen wir keine Änderungen, wir starten nur das Backend, das sich darin befindet.
- `workspace`: hierin befindet sich unsere React-Anwendung (bzw. der Ausgangspunkt davon). Hierin werden wir im wesentlichen Arbeiten und Übungen machen.

Wir arbeiten nur im Verzeichnis `workspace`. Deshalb bitte **nur dieses** Verzeichnis in deiner IDE öffnen (**nicht** das _ganze_ Repository)

- In IntelliJ oder Webstorm kannst du das `workspace`-Verzeichnis nach dem Klonen jeweils mit `File -> Open` auswählen und dann öffnen

> [!IMPORTANT]  
> Bitte führe die untenstehenden Schritte für beide Verzeichnisse **vor der Schulung** aus, damit wir sicher sind, dass alles bei der Schulung funktioniert.
> Gerade fehlende Berechtigungen, eingeschränkter Internet-Zugang (im Schulungsraum) etc. lassen sich während der Schulung meist nicht kurzfristig beheben.

## Schritt 1: Klonen des Repositories

- Bitte dieses Repository von GitHub klonen: https://github.com/nilshartmann-workshops/2026-09-01-react

## Schritt 2: Backend

- Im Verzeichnis `backend` die JavaScript Packages installieren:
  - ```bash
    cd backend
    npm install
    ```
- Dieses Verzeichnis brauchst du _nicht_ in deiner IDE zu öffnen, da wir hier keine Änderungen machen.

## Schritt 3: Frontend

- Im Verzeichnis `workspace` die Packages installieren:
  - ```bash
    cd workspace
    npm install
    ```
- Während der Schulung musst du dieses Verzeichnis in deiner IDE öffnen. Wir werden nur hier in diesem Verzeichnis arbeiten.

> [!TIP]
> Falls der Devserver später mit `Could not resolve "rxjs"` abbricht, hat `npm`
> die sogenannten Peer-Dependencies nicht mitinstalliert (das passiert, wenn in
> deiner npm-Konfiguration `legacy-peer-deps=true` steht). Dann hilft:
>
> ```bash
> npm install --no-legacy-peer-deps
> ```

# Starten der React-Anwendung (zum Prüfen, ob alles funktioniert)

Nach der Installation der Packages prüfe bitte, ob die Installation geklappt hat und alles funktioniert.

## Schritt 1: Starten des Backends

- Während der Schulung benötigen wir das Backend, um daraus Daten zu lesen und zu schreiben
- Das Backend läuft auf Port **7200**, d.h. dieser Port muss bei dir frei sein.
- Zum Starten im `backend`-Verzeichnis `npm start` verwenden
  - ```bash
      cd backend
      npm start
    ```
- Zum Testen ruf im Browser http://localhost:7200/graphql auf
  - Es sollte sich eine Oberfläche öffnen ("GraphiQL"), in der du GraphQL-Abfragen ausprobieren kannst. Damit arbeiten wir später im Workshop.
  - Links steht schon eine Abfrage. Drück auf den Play-Button. Rechts sollte dann eine Liste von Pflanzen erscheinen.

### Schritt 2: Starten des Frontends

- Das Frontend läuft auf Port **3000**, d.h. dieser Port muss bei dir frei sein.
- Zum Starten im `workspace`-Verzeichnis `npm run dev` verwenden
  - ```bash
      cd workspace
      npm run dev
    ```
- Nun sollte eine (fast) leere Anwendung im Browser zu sehen sein, die "🌱 Hello React 👋" ausgibt.

- Du kannst Backend und Frontend jetzt bis zur Schulung wieder beenden :-)

> [!TIP]
> Falls der Port 7200 bei dir belegt ist und du das Backend auf einem anderen
> Port startest (`SERVER_PORT=... npm start`), musst du die Backend-URL im
> `workspace` in diesen Dateien anpassen:
>
> 1. `src/apollo-client.ts`
> 2. `codegen.ts`
> 3. `graphql.config.yml`

# Übungen während des Workshops

Im Workshop zeige ich euch jedes Thema direkt bei mir im Editor (Live Coding). Nach jedem Thema macht ihr dann eine Übung (in der Regel genau das gleiche, was ihr vorher bei mir gesehen habt). Dazu committe ich nach jedem Thema "meinen" Code und eine Aufgabenbeschreibung und pushe beides auf einen eigenen Branch im GitHub-Repository.

Um die Übung dann zu machen, müsstest du also dann:
- den Stand in GitHub öffnen (s.u.)
- dort die Aufgabenbeschreibung lesen
- meine Änderungen dort kannst du als "Spickzettel" verwenden, wenn du mit einer Übung nicht weiterkommst.

Am besten öffnest du während des Workshops den GitHub-Branch (`live_coding`) im Browser in zwei Tabs, die du während des gesamten Workshops offen lässt:

1. Die Branch-Ansicht vom `live_coding`-Branch. Nützlich, wenn du eine Übersicht des Projektes im aktuellen Stand haben willst: https://github.com/nilshartmann-workshops/2026-09-01-react/tree/live_coding
  - Die Aufgaben-Beschreibungen findest du dann jeweils im Verzeichnis `AUFGABEN`: https://github.com/nilshartmann-workshops/2026-09-01-react/tree/live_coding/AUFGABEN
2. Die Commit-Ansicht. Nützlich wenn du genau die Änderungen sehen willst, die beim letzen Thema entstanden sind: https://github.com/nilshartmann-workshops/2026-09-01-react/commits/live_coding/

> [!TIP]  **Wichtig**
> Den `live_coding`-Branch brauchst du nicht bei dir lokal auszuchecken. Es ist am einfachsten, wenn du dir den Stand in GitHub ansiehst.

## Bei Fragen und Problemen

Wenn du Fragen oder Probleme bei der Installation hast, kannst du mich gerne kontaktieren. Meine Kontaktdaten findest du hier: https://nilshartmann.net/kontakt

Ich wünsche dir viel Spaß und Erfolg bei unserem Workshop!
