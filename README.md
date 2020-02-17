# Mediathek Frontend

Dies ist das Frontend der Mediathek unter [https://mediathek--2-0.herokuapp.com/](https://mediathek--2-0.herokuapp.com/). Ursprünglich ist diese Mediathek aus der Idee entstanden, dass es ganz nett wäre eine E-Mail zu bekommen wenn es einen neue Folge der Lieblingsserie in der Zdf Mediathek gibt. Mittlerweile werden in der dritten Iteration dieser Idee nicht nur E-Mails verschickt sondern auch Episoden heruntergeladen.

## Wie kommen Episoden in die Mediathek
Alle 15 Minuten wird die Mediathek von ZDF und ARD mit [youtube-dl](https://github.com/ytdl-org/youtube-dl) abgefragt. Daraufhin werden gewünschte Episoden mit [youtube-dl](https://github.com/ytdl-org/youtube-dl) heruntergeladen und in die Datenbank aufgenommen.

Die PWA "longpollt" wiederum eine Api beim Neuladen der Seite in einem [idle callback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback). Dies geschieht maximal einmal in der Minute.

In Zukunft soll dieser Ansatz durch [Server-Sent-Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) ersetzt werden, da dieser Ansatz um einiges eleganter ist.

## Die PWA

In diesem Frontend verwenden wir [Nuxt](https://nuxtjs.org/). Nuxt macht es uns einfach die Fähigkeiten von Vue auszuschöpfen, da es Konfigurung des Vue-Routers und Vuex, sowie die Authentifizierung durch das [Nuxt Auth Module](https://auth.nuxtjs.org/) und die des Service Worker mit [Nuxt PWA](https://pwa.nuxtjs.org/) durch Webpack übernimmt.

Die Episoden werden in Vuex mit Hilfe von [Vuex-ORM](https://github.com/vuex-orm/vuex-orm) und [vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate) in der PWA gespeichert, sodass die PWA auch offline Informationen über alle Episoden anzeigen kann. Außerdem können Episoden in den Web Cache heruntergeladen werden, die dann auch offline verfügbar sind.

