import { Line } from './line';
import shiftMessageContainer from './templates/line/shiftSchedule';

export const scheduled: ExportedHandlerScheduledHandler = async (event, env, ctx) => {
	ctx.waitUntil(sendDailySchedule(env));
};

const sendDailySchedule = async (env: any) => {
	const accessToken = env.LINE_CHANNEL_ACCESS_TOKEN;
	const to = env.LINE_PUSH_MESSAGE_TO;
	const date = new Date();
	const jstOffset = 9 * 60 * 60 * 1000; // UTCとの差分9時間をミリ秒に変換

	const response = await fetch(`${env.API_ENDPOINT_URL}?page=shift`).catch((err) => {
		console.error(err);
	});
	if (!response) return;

	const data = await response.json();
	const todayShift = data.find(
		(shiftSchedule) => new Date(new Date(shiftSchedule.date).getTime() + jstOffset).toDateString() === date.toDateString(),
	);

	const shiftMessage = shiftMessageContainer(todayShift);
	if (!shiftMessage) return;

	const lineClient = new Line(accessToken);
	const result = await lineClient.pushMessage([shiftMessage], to);
};
