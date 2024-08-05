# Telegram Webhook JS Documentation

## Overview

`telegram-webhook-js` is a library designed to interact with the Telegram Bot API, particularly suited for deployment in Cloudflare Workers. This library provides methods to send messages, handle updates, manage user data using KV storage, send photos, and set webhooks automatically.

## Installation

Install the library using npm:

```sh
npm install telegram-webhook-js
```

## Usage in Cloudflare Workers

### Importing the Library

First, import the `TelegramBot` class:

```js
import TelegramBot from 'telegram-webhook-js';
```

### Setting Up the Bot

Create an instance of the `TelegramBot` class by passing your bot token:

```js
const bot = new TelegramBot('YOUR_BOT_TOKEN_HERE');
```

### Setting the Webhook Automatically

Set the webhook URL when deploying your Cloudflare Worker:

```js
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/webhook') {
        const updates = await request.json();
        await bot.handleUpdate(updates);
        return new Response('OK', { status: 200 });
    }
    
    // Automatically set the webhook
    await bot.setWebhook(`https://${url.hostname}/webhook`);
    return new Response('Webhook set', { status: 200 });
}
```

### Handling Commands and User Data

Use KV storage to save, get, update, and delete user data based on commands:

```js
const KV_NAMESPACE = YOUR_KV_NAMESPACE;

async function handleUpdate(update) {
    const message = update.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text.trim().toLowerCase();

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Welcome! Use /save, /update, or /delete commands to manage your data.');
    } else if (text.startsWith('/save')) {
        const userData = text.slice(6).trim();
        await KV_NAMESPACE.put(`user_${chatId}`, userData);
        await bot.sendMessage(chatId, 'Data saved.');
    } else if (text.startsWith('/get')) {
        const data = await KV_NAMESPACE.get(`user_${chatId}`);
        await bot.sendMessage(chatId, 'Saved Data: '+data);
    } else if (text.startsWith('/update')) {
        const userData = text.slice(8).trim();
        await KV_NAMESPACE.put(`user_${chatId}`, userData);
        await bot.sendMessage(chatId, 'Data updated.');
    } else if (text.startsWith('/delete')) {
        await KV_NAMESPACE.delete(`user_${chatId}`);
        await bot.sendMessage(chatId, 'Data deleted.');
    } else {
        await bot.sendMessage(chatId, `Unknown command: ${text}`);
    }
}

bot.handleUpdate = handleUpdate;
```

### Sending Photos

Send photos based on commands:

```js
async function handleUpdate(update) {
    const message = update.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text.trim().toLowerCase();

    if (text === '/photo') {
        const photoUrl = 'https://example.com/photo.jpg';
        await bot.sendPhoto(chatId, photoUrl, { caption: 'Here is your photo!' });
    } else {
        await bot.sendMessage(chatId, `Unknown command: ${text}`);
    }
}

bot.handleUpdate = handleUpdate;
```

### Complete Cloudflare Worker Script

Here is a complete example of a Cloudflare Worker script using `telegram-webhook-js`:

```js
import TelegramBot from 'telegram-webhook-js';

const bot = new TelegramBot('YOUR_BOT_TOKEN_HERE');
const KV_NAMESPACE = 'YOUR_KV_NAMESPACE';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);

    if (url.pathname === '/webhook') {
        const updates = await request.json();
        await bot.handleUpdate(updates);
        return new Response('OK', { status: 200 });
    }

    // Automatically set the webhook
    await bot.setWebhook(`https://${url.hostname}/webhook`);
    return new Response('Webhook set', { status: 200 });
}

async function handleUpdate(update) {
    const message = update.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text.trim().toLowerCase();

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Welcome! Use /save, /update, or /delete commands to manage your data.');
    } else if (text.startsWith('/save')) {
        const userData = text.slice(6).trim();
        await KV_NAMESPACE.put(`user_${chatId}`, userData);
        await bot.sendMessage(chatId, 'Data saved.');
    }  else if (text.startsWith('/get')) {
        const data = await KV_NAMESPACE.get(`user_${chatId}`);
        await bot.sendMessage(chatId, 'Saved Data: '+data);
    } else if (text.startsWith('/update')) {
        const userData = text.slice(8).trim();
        await KV_NAMESPACE.put(`user_${chatId}`, userData);
        await bot.sendMessage(chatId, 'Data updated.');
    } else if (text.startsWith('/delete')) {
        await KV_NAMESPACE.delete(`user_${chatId}`);
        await bot.sendMessage(chatId, 'Data deleted.');
    } else if (text === '/photo') {
        const photoUrl = 'https://example.com/photo.jpg';
        await bot.sendPhoto(chatId, photoUrl, { caption: 'Here is your photo!' });
    } else {
        await bot.sendMessage(chatId, `Unknown command: ${text}`);
    }
}

bot.handleUpdate = handleUpdate;
```

### Conclusion

This documentation provides a comprehensive guide to using `telegram-webhook-js` in Cloudflare Workers. It covers setting up the webhook, handling commands, managing user data with KV storage, and sending photos. Customize the examples as needed to fit your specific use case.
