import WebKit

struct Cookie {
    var name: String
    var value: String
}

/// Chiave messaggio FCM. Dopo aver sostituito GoogleService-Info.plist, allinea a GCM_SENDER_ID.
let gcmMessageIDKey: String = {
    if let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
       let plist = NSDictionary(contentsOfFile: path),
       let senderId = plist["GCM_SENDER_ID"] as? String,
       !senderId.isEmpty,
       senderId != "000000000000" {
        return senderId
    }
    return "00000000000"
}()

// URL for first launch
let rootUrl = URL(string: "https://app.usa-la-testa.it")!

// allowed origin is for what we are sticking to pwa domain
// This should also appear in Info.plist
let allowedOrigins: [String] = ["app.usa-la-testa.it"]

// auth origins will open in modal and show toolbar for back into the main origin.
// These should also appear in Info.plist
let authOrigins: [String] = []
// allowedOrigins + authOrigins <= 10

let platformCookie = Cookie(name: "app-platform", value: "iOS App Store")

// UI options
let displayMode = "standalone" // standalone / fullscreen.
let adaptiveUIStyle = true     // iOS 15+ only. Change app theme on the fly to dark/light related to WebView background color.
let overrideStatusBar = false   // iOS 13-14 only. if you don't support dark/light system theme.
let statusBarTheme = "dark"    // dark / light, related to override option.
let pullToRefresh = true    // Enable/disable pull down to refresh page
