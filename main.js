// telegram-bot.js

export default class TelegramBot {
	constructor(token) {
		this.token = token;
		this.apiUrl = `https://api.telegram.org/bot${token}/`;
		this.callbacks = {}; // To store callback handlers
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

	async setWebhook(url) {
		try {
			const response = await fetch(`${this.apiUrl}setWebhook`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
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
				method: 'POST',
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error deleting webhook:', error);
		}
	}

	async sendMessage(chatId, text, options = {}) {
		const { parseMode, disableWebPagePreview, disableNotification, replyToMessageId, replyMarkup } = options;

		try {
			const response = await fetch(`${this.apiUrl}sendMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: chatId,
					text,
					parse_mode: parseMode,
					disable_web_page_preview: disableWebPagePreview,
					disable_notification: disableNotification,
					reply_to_message_id: replyToMessageId,
					reply_markup: replyMarkup,
				}),
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}

	async editMessageText(chatId, messageId, text, options = {}) {
		const { parseMode, disableWebPagePreview, replyMarkup } = options;

		try {
			const response = await fetch(`${this.apiUrl}editMessageText`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: chatId,
					message_id: messageId,
					text,
					parse_mode: parseMode,
					disable_web_page_preview: disableWebPagePreview,
					reply_markup: replyMarkup,
				}),
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error editing message text:', error);
		}
	}

	async deleteMessage(chatId, messageId) {
		try {
			const response = await fetch(`${this.apiUrl}deleteMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: chatId,
					message_id: messageId,
				}),
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error deleting message:', error);
		}
	}

	async sendPhoto(chatId, photo, options = {}) {
		const formData = new FormData();
		formData.append('chat_id', chatId);
		formData.append('photo', photo);

		// Append additional options
		for (const [key, value] of Object.entries(options)) {
			formData.append(key, value);
		}

		try {
			const response = await fetch(`${this.apiUrl}sendPhoto`, {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error sending photo:', error);
		}
	}

	async sendDocument(chatId, document, options = {}) {
		const formData = new FormData();
		formData.append('chat_id', chatId);
		formData.append('document', document);

		// Append additional options
		for (const [key, value] of Object.entries(options)) {
			formData.append(key, value);
		}

		try {
			const response = await fetch(`${this.apiUrl}sendDocument`, {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error sending document:', error);
		}
	}

	async sendSticker(chatId, sticker, options = {}) {
		const formData = new FormData();
		formData.append('chat_id', chatId);
		formData.append('sticker', sticker);

		// Append additional options
		for (const [key, value] of Object.entries(options)) {
			formData.append(key, value);
		}

		try {
			const response = await fetch(`${this.apiUrl}sendSticker`, {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			return data.result;
		} catch (error) {
			console.error('Error sending sticker:', error);
		}
	}

	async sendInlineKeyboard(chatId, text, buttons, options = {}) {
		// Create inline keyboard markup
		const replyMarkup = {
			inline_keyboard: buttons.map((row) =>
				row.map((button) => ({
					text: button.text,
					callback_data: button.callbackData,
				}))
			),
		};

		return this.sendMessage(chatId, text, { ...options, replyMarkup });
	}

	async handleUpdate(update) {
		if (update.callback_query) {
			await this.handleCallbackQuery(update.callback_query);
		}
	}

	async handleCallbackQuery(callbackQuery, answer = true) {
		const callbackData = callbackQuery.data;
		const chatId = callbackQuery.message.chat.id;

		try {
			if (this.callbacks[callbackData]) {
				await this.callbacks[callbackData](callbackQuery);
			} else {
				console.error(`No handler for callback data: ${callbackData}`);
			}

			if (answer) {
				// Answer the callback query to remove the loading state of the button
				await fetch(`${this.apiUrl}answerCallbackQuery`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ callback_query_id: callbackQuery.id}),
				});
			}
		} catch (error) {
			console.error('Error handling callback query:', error);
		}
	}
	async answerCallbackQuery(callbackQuery, text = undefined, show_alert = false) {
		// Answer the callback query to remove the loading state of the button
		await fetch(`${this.apiUrl}answerCallbackQuery`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ callback_query_id: callbackQuery.id, text: text, show_alert: show_alert }),
		});
	}
	// Method to register a callback handler
	onCallback(callbackData, handler) {
		this.callbacks[callbackData] = handler;
	}
}
