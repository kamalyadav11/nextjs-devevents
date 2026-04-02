import {
	Schema,
	Types,
	model,
	models,
	type HydratedDocument,
	type InferSchemaType,
	type Model,
} from 'mongoose';

import { Event } from './event.model';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema(
	{
		eventId: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	}
);

bookingSchema.index({ eventId: 1 });

type BookingSchemaType = InferSchemaType<typeof bookingSchema> & {
	eventId: Types.ObjectId;
};
export type BookingDocument = HydratedDocument<BookingSchemaType>;
export type BookingModel = Model<BookingSchemaType>;

bookingSchema.pre(
	'save',
	async function validateBookingReference(this: BookingDocument) {
		const normalizedEmail = this.email.trim().toLowerCase();

		if (!EMAIL_REGEX.test(normalizedEmail)) {
			throw new Error('Booking email must be a valid email address.');
		}

		this.email = normalizedEmail;

		// Guard against bookings that reference events that do not exist.
		if (this.isModified('eventId') || this.isNew) {
			const eventExists = await Event.exists({ _id: this.eventId });

			if (!eventExists) {
				throw new Error('Booking eventId must reference an existing event.');
			}
		}
	}
);

export const Booking =
	(models.Booking as BookingModel | undefined) ??
	model<BookingSchemaType, BookingModel>('Booking', bookingSchema);

