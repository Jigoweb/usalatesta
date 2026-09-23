# Patch Firebase Analytics per progetto Android TWA (Bubblewrap / PWABuilder)

Lo zip *Google Play package* non include questi file. Applica le patch sul **progetto sorgente** Android generato da Bubblewrap/PWABuilder.

Package atteso: `app.vercel.traeusalatesta0vr4.twa`

## 1. File Firebase

Copia `google-services.json` (da Firebase Console) in:

```
app/google-services.json
```

Esempio di struttura: `google-services.json.example` in questa cartella.

## 2. Project `build.gradle` (root)

Aggiungi il plugin Google Services nella `buildscript` / `plugins` (sintassi dipende dalla versione Bubblewrap):

```gradle
// plugins DSL (preferito)
plugins {
    id 'com.google.gms.google-services' version '4.4.2' apply false
}
```

oppure legacy:

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.2'
    }
}
```

## 3. Module `app/build.gradle`

In fondo al file:

```gradle
plugins {
    // ... existing
    id 'com.google.gms.google-services'
}

dependencies {
    // ... existing TWA deps
    implementation platform('com.google.firebase:firebase-bom:33.7.0')
    implementation 'com.google.firebase:firebase-analytics'
}
```

## 4. (Opzionale) Application class

Se il progetto ha una `Application` custom, in `onCreate()`:

```kotlin
// first_open parte automaticamente dopo l'init di Firebase via google-services plugin.
// Evento di controllo:
Firebase.analytics.logEvent("native_shell_ready") {
    param("platform", "android")
    param("shell", "twa")
}
```

Con solo il plugin + `google-services.json`, **`first_open` è già automatico** al primo avvio.

## 5. Build

```bash
./gradlew bundleRelease
```

Firma con lo stesso keystore usato per le build Play già pubblicate.
