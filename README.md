# Service Monitor

This Node.js application pings a given endpoint at a predefined interval. If the service is down, it sends an email alert once and continues checking until the service recovers.

## Features
- Periodically pings a specified service.
- Sends an email alert if the service is down.
- Sends only one email per downtime period.
- Logs timestamped messages in the format `[DD/Mon/YYYY HH:MM:SS]`.

## Requirements
- Node.js (>=14.x)
- npm (>=6.x)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Yurius007/Monitor.git
   cd Monitor
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration
Create a `.env` file in the root directory with the following variables:
```env
PING_URL=https://your-service.com
PING_INTERVAL=10000
ALERT_EMAIL=your-alert-email@example.com
MAIL_ADDRESS=your-email@example.com
MAIL_PASS=your-email-password
```

### Configuring Mail Settings
1. Use a valid SMTP email provider such as Gmail, Outlook, or a custom SMTP server.
2. If using Gmail, enable "Less secure app access" or generate an app password [see more about it here](https://support.google.com/mail/answer/185833?hl=en).
3. Replace `MAIL_ADDRESS` and `MAIL_PASS` with your email credentials.

## Usage
Run the service monitor with:
```sh
node monitor.js
```

## Docker setup instructions
1. Go to the project directory:
   ```bash
   cd Ethertrac
   ```
2. Make sure you created `.env` file with right configuration.
3. Pull image and run docker container:

   ```bash
   docker run -d --name monitor-app --env-file .env  yurius007/node-monitor-app:v1.0
   ```
   ```bash
   docker run --platform linux/amd64 -d --name monitor-app --env-file .env  yurius007/node-monitor-app:v1.0 # For MacOS
   ```
