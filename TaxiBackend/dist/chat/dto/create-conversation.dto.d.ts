export declare class CreateConversationDto {
    type: 'user_driver' | 'user_support' | 'driver_support';
    participants: {
        userId: string;
        role: 'user' | 'driver' | 'support';
    }[];
}
