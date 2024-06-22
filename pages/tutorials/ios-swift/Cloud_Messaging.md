
# Firebase Cloud Messaging with iOS (Swift)

## Step 1: Add Firebase to Your iOS Project

Add the necessary Firebase dependencies to your `Podfile`.

```ruby
platform :ios, '10.0'

target 'YourTargetName' do
  use_frameworks!

  pod 'Firebase/Core'
  pod 'Firebase/Messaging'
end
```

Then, run `pod install` to install these dependencies.

## Step 2: Initialize Firebase in Your App

Initialize Firebase in your iOS app. This is usually done in the `AppDelegate.swift` file.

```swift
// AppDelegate.swift
import UIKit
import Firebase
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
    
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()

        UNUserNotificationCenter.current().delegate = self
        Messaging.messaging().delegate = self
        
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            print("Permission granted: \(granted)")
        }
        
        application.registerForRemoteNotifications()
        
        Messaging.messaging().token { token, error in
            if let error = error {
                print("Error fetching FCM registration token: \(error)")
            } else if let token = token {
                print("FCM registration token: \(token)")
                // TODO: If necessary send token to application server.
            }
        }
        
        return true
    }

    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("Firebase registration token: \(String(describing: fcmToken))")
        // TODO: If necessary send token to application server.
    }

    // Handle incoming messages
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        print("Message ID: \(userInfo["gcm.message_id"] ?? "")")
        print(userInfo)
        completionHandler(UIBackgroundFetchResult.newData)
    }
}
```

## Step 3: Configure Your Firebase Console

Make sure your Firebase project is correctly set up in the Firebase Console to handle Cloud Messaging.

## Step 4: Deploy and Test

Deploy your iOS app and test sending notifications from the Firebase Console to ensure that both foreground and background messages are received correctly.
