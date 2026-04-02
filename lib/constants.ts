export type Event = {
	title: string;
	image: string;
	slug: string;
	location: string;
	date: string;
	time: string;
};

export const events: Event[] = [
	{
		title: 'DevOpsDays Atlanta 2026',
		image: '/images/event1.png',
		slug: 'devopsdays-atlanta-2026',
		location: 'Atlanta, Georgia',
		date: 'Apr 21-22, 2026',
		time: '9:00 AM',
	},
	{
		title: 'PyCon US 2026',
		image: '/images/event2.png',
		slug: 'pycon-us-2026',
		location: 'Long Beach, California',
		date: 'May 15-17, 2026',
		time: '10:00 AM',
	},
	{
		title: 'Open Source Summit North America 2026',
		image: '/images/event3.png',
		slug: 'open-source-summit-na-2026',
		location: 'Minneapolis, Minnesota',
		date: 'May 18-20, 2026',
		time: '9:30 AM',
	},
	{
		title: 'OpenSSF Community Day NA 2026',
		image: '/images/event4.png',
		slug: 'openssf-community-day-na-2026',
		location: 'Minneapolis, Minnesota',
		date: 'May 21, 2026',
		time: '9:00 AM',
	},
	{
		title: 'ETHConf 2026',
		image: '/images/event5.png',
		slug: 'ethconf-2026',
		location: 'New York City, New York',
		date: 'Jun 8-10, 2026',
		time: '10:00 AM',
	},
	{
		title: 'GitHub Universe 2026',
		image: '/images/event6.png',
		slug: 'github-universe-2026',
		location: 'San Francisco, California',
		date: 'Oct 28-29, 2026',
		time: '9:00 AM',
	},
];
