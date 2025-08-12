class Notification {
  send(message, recipient) {
    throw new Error("Method 'send()' must be implemented.");
  }
}
class EmailNotification extends Notification {
  send(message, recipient) {
    console.log(`Sending Email to ${recipient}: ${message}`);
  }
}

class SMSNotification extends Notification {
  send(message, recipient) {
    console.log(`Sending SMS to ${recipient}: ${message}`);
  }
}

class PushNotification extends Notification {
  send(message, recipient) {
    console.log(`Sending Push Notification to ${recipient}: ${message}`);
  }
}

class NotificationManager {
  constructor(channel) {
    this.channel = channel; 
  }
  notify(message, recipient) {
    this.channel.send(message, recipient);
  }
}

const emailNotification = new EmailNotification();
const notificationManager = new NotificationManager(emailNotification);

notificationManager.notify("Your order has been shipped!", "user@example.com");

const smsNotification = new SMSNotification();
const smsManager = new NotificationManager(smsNotification);

smsManager.notify("Your OTP is 123456", "+1234567890");
