import { User } from '../../user/user.entity';
import { Status } from '../../status/status.entity';
import { TripPurpose } from '../../purposes/trip-purpose.entity';
import { OrderPreference } from '../../preferences/order-preferences.entity';
import { Segment } from '../../segments/segment.entity';
export declare class Order {
    id: string;
    user: User;
    dispatcher: User;
    status: Status;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    purpose: TripPurpose;
    vehicleType: string;
    preferences: OrderPreference[];
    segments: Segment[];
}
