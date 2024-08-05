// telegram-bot.js

export default class TelegramBot {
    constructor(token) {
      this.token = token;
      this.apiUrl = `https://api.telegram.org/bot${token}/`;
    }
  
    async getUpdates(offset = 0) {
      try {
        const response = await fetch(`${this.apiUrl}getUpdates?offset=${offset}`);
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error('Error getting updates:', error);
      }
    }
  
    async sendMessage(chatId, text) {
      try {
        const response = await fetch(`${this.apiUrl}sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text
          })
        });
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  
    async setWebhook(url) {
      try {
        const response = await fetch(`${this.apiUrl}setWebhook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: url
          })
        });
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error('Error setting webhook:', error);
      }
    }
  
    async deleteWebhook() {
      try {
        const response = await fetch(`${this.apiUrl}deleteWebhook`, {
          method: 'POST'
        });
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error('Error deleting webhook:', error);
      }
    }
  }
  