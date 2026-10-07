/*
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package app.vercel.traeusalatesta0vr4.twa;

import android.os.Bundle;
import com.google.firebase.analytics.FirebaseAnalytics;

public class Application extends android.app.Application {
  @Override
  public void onCreate() {
    super.onCreate();
    // first_open is emitted automatically by Firebase Analytics on first install/open.
    // native_shell_ready is a sanity-check event visible in DebugView.
    FirebaseAnalytics analytics = FirebaseAnalytics.getInstance(this);
    Bundle params = new Bundle();
    params.putString("platform", "android");
    params.putString("shell", "twa");
    analytics.logEvent("native_shell_ready", params);
  }
}
