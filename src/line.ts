import { FlexMessage, TextMessage } from '@line/bot-sdk';

export class Line {
	private readonly headers: Record<string, string>;
	private readonly baseUrl = 'https://api.line.me/v2/bot';

	constructor(accessToken: string) {
		this.headers = {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		};
	}

	public async replyMessage(messages: Array<TextMessage>, replyToken: string): Promise<Response | null> {
		return await fetch(`${this.baseUrl}/message/reply`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({
				replyToken: replyToken,
				messages: messages,
			}),
		}).catch((err) => {
			console.error(`[LINE] replyMessage error: ${err}`);
			return null;
		});
	}

	public async pushMessage(messages: Array<TextMessage | FlexMessage>, to: string): Promise<Response | null> {
		return await fetch(`${this.baseUrl}/message/push`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ to: to, messages: messages }),
		}).catch((err) => {
			console.log(`[LINE] pushMessage error: ${err}`);
			return null;
		});
	}
}
