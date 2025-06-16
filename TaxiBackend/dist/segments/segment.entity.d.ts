import { Order } from '../orders/entities/order.entity';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicles/vehicle.entity';
import { Address } from '../address/address.entity';
import { Status } from '../status/status.entity';
export declare class Segment {
    id: string;
    order: Order;
    driver: User;
    vehicle: Vehicle;
    fromAddress: Address;
    toAddress: Address;
    status: Status;
    departureTime: Date;
    arrivalTime: Date;
    comment: string;
}
