import {
	Model,
	Schema,
	model,
	models,
	type HydratedDocument,
	type InferSchemaType,
} from 'mongoose';

const slugifyTitle = (value: string): string =>
	value
		.toLowerCase()
		.trim()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const normalizeDate = (value: string): string => {
	const parsedDate = new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		throw new Error('Event date must be a valid date.');
	}

	// Store the date in ISO-8601 calendar form to keep it stable and searchable.
	return parsedDate.toISOString().slice(0, 10);
};

const normalizeTime = (value: string): string => {
	const trimmedValue = value.trim().toLowerCase();
	const match = trimmedValue.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]m)?$/);

	if (!match) {
		throw new Error(
			'Event time must be in a valid format such as 09:30 or 9:30 PM.',
		);
	}

	let hours = Number(match[1]);
	const minutes = Number(match[2] ?? '0');
	const meridiem = match[3];

	if (minutes < 0 || minutes > 59) {
		throw new Error('Event time contains invalid minutes.');
	}

	if (meridiem) {
		if (hours < 1 || hours > 12) {
			throw new Error('Event time contains an invalid 12-hour value.');
		}

		if (meridiem === 'pm' && hours !== 12) {
			hours += 12;
		}

		if (meridiem === 'am' && hours === 12) {
			hours = 0;
		}
	} else if (hours < 0 || hours > 23) {
		throw new Error('Event time contains an invalid 24-hour value.');
	}

	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const eventSchema = new Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true },
		description: { type: String, required: true, trim: true },
		overview: { type: String, required: true, trim: true },
		image: { type: String, required: true, trim: true },
		venue: { type: String, required: true, trim: true },
		location: { type: String, required: true, trim: true },
		date: { type: String, required: true, trim: true },
		time: { type: String, required: true, trim: true },
		mode: { type: String, required: true, trim: true },
		audience: { type: String, required: true, trim: true },
		agenda: {
			type: [{ type: String, trim: true }],
			required: true,
		},
		organizer: { type: String, required: true, trim: true },
		tags: {
			type: [{ type: String, trim: true }],
			required: true,
		},
	},
	{
		timestamps: true, //Mongoose automatically adds and updates: createdAt updatedAt
	},
);

eventSchema.index({ slug: 1 }, { unique: true });

type EventSchemaType = InferSchemaType<typeof eventSchema>;
export type EventDocument = HydratedDocument<EventSchemaType>;
export type EventModel = Model<EventSchemaType>;

eventSchema.pre(
	'save',
	function validateAndNormalizeEvent(this: EventDocument) {
		const stringFields: Array<
			keyof Pick<
				EventSchemaType,
				| 'title'
				| 'description'
				| 'overview'
				| 'image'
				| 'venue'
				| 'location'
				| 'date'
				| 'time'
				| 'mode'
				| 'audience'
				| 'organizer'
			>
		> = [
			'title',
			'description',
			'overview',
			'image',
			'venue',
			'location',
			'date',
			'time',
			'mode',
			'audience',
			'organizer',
		];

		for (const field of stringFields) {
			const value = this.get(field);

			if (typeof value !== 'string' || value.trim().length === 0) {
				throw new Error(`Event ${field} is required.`);
			}

			this.set(field, value.trim());
		}

		const agendaItems = this.agenda
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
		const tagItems = this.tags
			.map((item) => item.trim())
			.filter((item) => item.length > 0);

		if (agendaItems.length === 0) {
			throw new Error('Event agenda must contain at least one item.');
		}

		if (tagItems.length === 0) {
			throw new Error('Event tags must contain at least one item.');
		}

		this.agenda = agendaItems;
		this.tags = tagItems;

		// Normalize these fields before persistence so reads stay predictable.
		this.date = normalizeDate(this.date);
		this.time = normalizeTime(this.time);

		// Only regenerate the slug when the title changed or the slug is missing.
		if (this.isModified('title') || !this.slug) {
			this.slug = slugifyTitle(this.title);
		}
	},
);

export const Event =
	(models.Event as EventModel | undefined) ??
	model<EventSchemaType, EventModel>('Event', eventSchema);
