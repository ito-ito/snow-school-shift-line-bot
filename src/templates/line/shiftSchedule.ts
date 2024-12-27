import { FlexComponent, FlexMessage } from '@line/bot-sdk';

type PresenterProps = {
	date: Date;
	details: {
		category: string;
		roles: {
			role: string;
			memberNames: Array<string>;
		}[];
	}[];
	url: string;
};

const shiftMessagePresenter = ({ date, details, url }: PresenterProps): FlexMessage => {
	const shiftContents: FlexComponent[] = details.flatMap((detail) => {
		return [
			{
				type: 'text',
				text: detail.category,
				margin: 'lg',
			} as const,
			{
				type: 'separator',
				margin: 'sm',
			} as const,
			...detail.roles.flatMap((role) => {
				return role.memberNames.flatMap((memberName) => {
					return {
						type: 'box',
						layout: 'horizontal',
						contents: [
							{
								type: 'text',
								text: memberName,
								size: 'sm',
								color: '#111111',
							} as const,
							{
								type: 'text',
								text: role.role === '' ? ' ' : role.role,
								size: 'sm',
								color: '#aaaaaa',
								align: 'end',
							} as const,
						],
					};
				});
			}),
		];
	});

	return {
		type: 'flex',
		altText: '明日の勤務予定をお知らせします',
		contents: {
			type: 'bubble',
			body: {
				type: 'box',
				layout: 'vertical',
				contents: [
					{
						type: 'text',
						text: '予定',
						weight: 'bold',
						color: '#1DB446',
						size: 'sm',
					},
					{
						type: 'text',
						text: date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }),
						weight: 'bold',
						size: 'xxl',
						margin: 'md',
					},
					{
						type: 'text',
						text: '明日の勤務予定をお伝えします',
						size: 'xs',
						color: '#aaaaaa',
						wrap: true,
					},
					{
						type: 'box',
						layout: 'vertical',
						margin: 'xxl',
						spacing: 'sm',
						contents: shiftContents,
					},
				],
			},
			footer: {
				type: 'box',
				layout: 'vertical',
				spacing: 'sm',
				contents: [
					{
						type: 'text',
						text: '最新の情報は勤務予定表からご確認ください',
						color: '#aaaaaa',
						size: 'xs',
						margin: 'xl',
					},
					{
						type: 'button',
						style: 'primary',
						height: 'sm',
						action: {
							type: 'uri',
							label: '勤務予定表を確認する',
							uri: url,
						},
					},
				],
			},
			styles: {
				footer: {
					separator: true,
				},
			},
		},
	};
};

type ContainerProps = {
	id: string;
	date: string;
	details: {
		category: string;
		roles: {
			role: string;
			members: {
				id: string;
				name: string;
				qualification: string;
				disabled: boolean;
				displayName: string;
			}[];
		}[];
	}[];
	url: string;
};

const shiftMessageContainer = ({ date, details, url }: ContainerProps): FlexMessage | undefined => {
	const jstOffset = 9 * 60 * 60 * 1000; // UTCとの差分9時間をミリ秒に変換

	if (!details.length) return;

	return shiftMessagePresenter({
		date: new Date(new Date(date).getTime() + jstOffset),
		details: details.map((detail) => {
			return {
				category: detail.category,
				roles: detail.roles.map((role) => {
					return {
						role: role.role,
						memberNames: role.members.map((member) => member.name),
					};
				}),
			};
		}),
		url: url,
	});
};

export default shiftMessageContainer;
