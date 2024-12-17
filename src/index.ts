import { TextEventMessage, WebhookEvent } from '@line/bot-sdk';
import { Hono } from 'hono';
import { Line } from './line';
import { scheduled } from './worker';

const app = new Hono();

app.get('*', (c) => c.text('Hello World!'));

app.post('/api/webhook', async (c) => {
	const data = await c.req.json();
	const events: WebhookEvent[] = (data as any).events;

	// テキストメッセージの最初の1件のみを対象とする
	const event = events
		.map((event: WebhookEvent) => {
			if (
				event.type != 'message' ||
				event.message.type != 'text' ||
				!event.message.mention?.mentionees.some((mentionee) => mentionee?.isSelf)
			) {
				return;
			}
			return event;
		})
		.filter((event) => event)[0];

	if (!event) {
		console.log(`No event: ${events}`);
		return c.json({ message: 'ok' });
	}

	const { replyToken } = event;
	const { text: my_message } = event.message as TextEventMessage;

	const lineClient = new Line(c.env.LINE_CHANNEL_ACCESS_TOKEN);
	await lineClient.replyMessage([{ type: 'text', text: my_message }], replyToken);
});

export default {
	fetch: app.fetch,
	scheduled,
};
