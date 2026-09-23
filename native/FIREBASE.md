# Firebase Analytics — app native Usa la Testa

Guida per `first_open` e analytics nativi su **iOS** (PWABuilder) e **Android** (TWA / Play package).

> La PWA web continua con **GTM + Consent Mode + Cookiebot**. Firebase qui serve allo **shell nativo** (store), non sostituisce il dataLayer web.

## Identificatori app

| Piattaforma | ID |
|-------------|-----|
| iOS bundle | `it.usa-la-testa.app` |
| Android package | `app.vercel.traeusalatesta0vr4.twa` |
| Start URL | `https://app.usa-la-testa.it` |

## 1. Console Firebase (una tantum)

1. Crea/apri un progetto Firebase (idealmente collegato allo stesso GA4 del web).
2. Aggiungi app **iOS** con bundle `it.usa-la-testa.app` → scarica `GoogleService-Info.plist`.
3. Aggiungi app **Android** con package `app.vercel.traeusalatesta0vr4.twa` → scarica `google-services.json`.
4. In GA4 verifica gli stream **iOS** e **Android** (oltre al web).

## 2. iOS — già cablato in `native/ios`

### Cosa è stato fatto nel codice
- Pod `Firebase/Analytics` + `Firebase/Messaging`
- `FirebaseApp.configure()` all’avvio **solo se** il plist non è più il placeholder PWABuilder
- Evento di controllo `native_shell_ready` (oltre al `first_open` automatico)
- `gcmMessageIDKey` letto da `GCM_SENDER_ID` del plist

### Cosa devi fare tu (Mac + Xcode)
1. Sostituisci `native/ios/USA LA TESTA/GoogleService-Info.plist` con il file reale da Firebase Console.
2. Da Terminale:
   ```bash
   cd native/ios
   pod install
   open "USA LA TESTA.xcworkspace"
   ```
3. Build su device/simulatore → in Firebase **DebugView** cerca `first_open` e `native_shell_ready`.
4. Solo dopo: Archive → TestFlight / App Store.

> Finché resta il plist placeholder (`PROJECT_ID = pwabuilder-ios-template`), Firebase **non** parte (evita crash).

## 3. Android — lo zip Play è solo APK/AAB

Lo zip *Google Play package* di PWABuilder **non contiene il progetto Gradle**: solo `.apk` / `.aab` + keystore.  
**Non si può iniettare Firebase Analytics dentro l’APK già compilato in modo supportato.**

### Percorso consigliato
1. Su [PWABuilder](https://www.pwabuilder.com/) rigenera il package Android e scarica anche il **progetto Android / codice sorgente** (Bubblewrap), **oppure**:
   ```bash
   npx @bubblewrap/cli init --manifest https://app.usa-la-testa.it/manifest.webmanifest
   # packageId: app.vercel.traeusalatesta0vr4.twa
   ```
2. Copia `google-services.json` in `app/`.
3. Applica le patch in `native/android/firebase-patches/` (Gradle + Application class).
4. Rebuild AAB firmato con lo **stesso** keystore già usato su Play (quello nello zip locale — **non** committare password/keystore su git).

Snippet riassuntivi anche in `native/android/firebase-patches/README.md`.

## 4. Cosa traccia Firebase vs GTM

| Evento | Dove |
|--------|------|
| `first_open` nativo | Firebase Analytics (SDK iOS/Android) |
| `pwa_first_open` | dataLayer web (già in prod) |
| Catalogo EventCatalog (`test_tap`, …) | dataLayer → GTM → GA4/Meta/GAds |
| `native_shell_ready` | Firebase (sanity check shell) |

Non unificare `first_open` e `pwa_first_open`: sono segnali diversi (install/shell vs prima visita web).

## 5. Sicurezza keystore

Lo zip Android include `signing.keystore` e password in chiaro.  
**Non** vanno in repository. Tienili in un secret manager / password vault del team.  
Se lo zip è circolato in chat/email non protette, valuta di **ruotare** le password del keystore dove possibile e limitare l’accesso.
