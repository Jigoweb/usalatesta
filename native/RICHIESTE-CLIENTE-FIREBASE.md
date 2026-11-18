# Richieste al cliente — Firebase Analytics (app store)

Per attivare il monitoraggio nativo sulle app iOS/Android (es. **prima apertura** / `first_open`) servono i seguenti elementi dal vostro progetto Firebase / GA4.

## File da fornire

| File | Piattaforma | ID app da usare in Firebase |
|------|-------------|-----------------------------|
| `GoogleService-Info.plist` | iOS | Bundle ID: `it.usa-la-testa.app` |
| `google-services.json` | Android | Package name: `app.vercel.traeusalatesta0vr4.twa` |

I file si scaricano dalla [Firebase Console](https://console.firebase.google.com/) dopo aver aggiunto le due app al progetto.

## Allineamento analytics

- Usare (o collegare) lo **stesso progetto GA4** già impiegato per il web / GTM (`GTM-KHV3DFNR`).
- Confermare che siano previsti stream **iOS** e **Android** (oltre al web).

## Accessi (alternativa ai file)

Se preferite non inviare i file:
- accesso **Editor** (o almeno sufficiente a creare le app e scaricare i config) al progetto Firebase collegato a GA4.

## Opzionale

- Accesso in sola lettura a **Analytics / DebugView** per la validazione post-rilascio.
- Conferma se, oltre ad Analytics, serve anche **Firebase Cloud Messaging** (push).
