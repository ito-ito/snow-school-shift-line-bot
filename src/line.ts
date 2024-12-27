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

	public async replyMessage(messages: Array<TextMessage>, replyToken: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/message/reply`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({
				replyToken: replyToken,
				messages: messages,
			}),
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
	}

	public async pushMessage(messages: Array<TextMessage | FlexMessage>, to: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/message/push`, {
			method: 'POST',
			headers: this.headers,
			body: JSON.stringify({ to: to, messages: messages }),
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
	}
}
