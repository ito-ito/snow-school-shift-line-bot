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
};

const shiftMessagePresenter = ({ date, details }: PresenterProps): FlexMessage => {
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
		altText: '勤務予定',
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
						text: '勤務情報をお伝えします',
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
					{
						type: 'text',
						text: '最新の勤務情報は勤務表からご確認ください',
						color: '#aaaaaa',
						size: 'xs',
						margin: 'xl',
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
};

const shiftMessageContainer = ({ date, details }: ContainerProps): FlexMessage | undefined => {
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
	});
};

export default shiftMessageContainer;
