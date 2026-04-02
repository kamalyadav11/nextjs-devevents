'use client';
import Image from 'next/image';
import posthog from 'posthog-js';

const ExploreBtn = () => {
	return (
		<button
			onClick={() => {
				console.log('Clicked');
				posthog.capture('explore_events_clicked');
			}}
			id="explore-btn"
			className="mt-7 mx-auto"
		>
			<a href="#events">
				Explore Events
				<Image
					src="/icons/arrow-down.svg"
					alt="Arrow down"
					width={24}
					height={24}
				/>
			</a>
		</button>
	);
};

export default ExploreBtn;
