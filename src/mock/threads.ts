
import type { ChatMessage, ChatThread } from "../types/chat";

const SUBTITLE = "WhatsApp (Forest hotel support WhatsApp)";

const jan = (day: number, hh: number, mm: number) =>
    Date.UTC(2026, 0, day, hh, mm, 0, 0); // Jan = 0; UTC for stability

type Dir = "incoming" | "outgoing";

function msgText(id: string, direction: Dir, createdAt: number, text: string): ChatMessage {
    return { id, type: "text", direction, createdAt, text } as ChatMessage;
}

function msgImage(
    id: string,
    direction: Dir,
    createdAt: number,
    url: string,
    caption?: string
): ChatMessage {
    return { id, type: "image", direction, createdAt, url, caption } as ChatMessage;
}

// Curated images (stable URLs)
const IMG = {
    lobby: "https://homework-bucket-images.s3.eu-north-1.amazonaws.com/IMG_1143.jpeg",
    breakfast: "https://picsum.photos/id/1080/1200/800",
    room: "https://picsum.photos/id/1018/1200/800",
    spa: "https://picsum.photos/id/1025/1200/800",
    restaurant: "https://picsum.photos/id/1035/1200/800",
    parking: "https://picsum.photos/id/1043/1200/800",
    map: "https://picsum.photos/id/1015/1200/800",
};

function thread(id: string, title: string, allMessages: ChatMessage[]): ChatThread {
    // Ensure chronological order (important for dividers + pagination)
    const sorted = [...allMessages].sort((a, b) => a.createdAt - b.createdAt);
    return {
        id,
        title,
        subtitle: SUBTITLE,
        allMessages: sorted,
    };
}

export function makeMockThreads(): ChatThread[] {
    const alice: ChatThread = thread("chat_alice", "Alice Green", [
        // Jan 2
        msgText("chat_alice_001", "incoming", jan(2, 11, 58), "Hi! We’re arriving late tonight. Is late check-in possible?"),
        msgText("chat_alice_002", "outgoing", jan(2, 12, 2), "Yes — late check-in is available. What time do you expect to arrive?"),
        msgText("chat_alice_003", "incoming", jan(2, 12, 6), "Around 23:30. Also, do you have parking?"),
        msgText("chat_alice_004", "outgoing", jan(2, 12, 9), "We do. Underground parking is available (limited spots). I can reserve one for you."),
        msgImage("chat_alice_005", "outgoing", jan(2, 12, 10), IMG.parking, "Parking entrance (follow the blue P signs)"),
        msgText("chat_alice_006", "incoming", jan(2, 12, 13), "Perfect — please reserve it. Do you need the car plate number?"),
        msgText("chat_alice_007", "outgoing", jan(2, 12, 16), "Not required. Just mention your name at the barrier intercom if needed."),

        // Jan 3
        msgText("chat_alice_008", "incoming", jan(3, 8, 55), "Good morning! What are breakfast hours?"),
        msgText("chat_alice_009", "outgoing", jan(3, 8, 58), "Breakfast is 07:00–10:30."),
        msgImage("chat_alice_010", "outgoing", jan(3, 9, 4), IMG.breakfast, "Breakfast buffet (fruit + warm options)"),
        msgText("chat_alice_011", "incoming", jan(3, 9, 10), "Looks great. Can we get a quiet room away from the elevator?"),
        msgText("chat_alice_012", "outgoing", jan(3, 9, 13), "Noted. I’ll assign a quiet room on a higher floor."),

        // Jan 5
        msgText("chat_alice_013", "incoming", jan(5, 18, 22), "Do you have a map of nearby restaurants or cafés?"),
        msgText("chat_alice_014", "outgoing", jan(5, 18, 26), "Yes — here are a few nearby options and a quick walking map."),
        msgImage("chat_alice_015", "outgoing", jan(5, 18, 27), IMG.map, "Nearby cafés (5–10 min walk)"),
        msgText("chat_alice_016", "incoming", jan(5, 18, 31), "Nice. Is there a good place for dessert close by?"),
        msgText("chat_alice_017", "outgoing", jan(5, 18, 35), "Corner Roasters does great pastries; also Sweet Lane is open until 21:00."),

        // Jan 6
        msgText("chat_alice_018", "incoming", jan(6, 17, 35), "Could we book a table for two this Saturday at 19:00?"),
        msgText("chat_alice_019", "outgoing", jan(6, 17, 40), "Yes. Any preferences (window, vegetarian options, celebration)?"),
        msgText("chat_alice_020", "incoming", jan(6, 17, 44), "It’s an anniversary. Window seat if possible."),
        msgImage("chat_alice_021", "outgoing", jan(6, 17, 48), IMG.restaurant, "Restaurant ambience (evening lighting)"),
        msgText("chat_alice_022", "outgoing", jan(6, 17, 49), "Booked: Saturday 19:00, table for two, window preference noted."),

        // Jan 9
        msgText("chat_alice_023", "incoming", jan(9, 10, 12), "Do you have an iron in the room?"),
        msgText("chat_alice_024", "outgoing", jan(9, 10, 15), "Yes — there’s an iron and board in the wardrobe."),
        msgText("chat_alice_025", "incoming", jan(9, 10, 18), "Great, thanks."),

        // Jan 10
        msgText("chat_alice_026", "incoming", jan(10, 8, 22), "Any chance for a late checkout on Sunday?"),
        msgText("chat_alice_027", "outgoing", jan(10, 8, 26), "Late checkout is available until 14:00 for your booking. Shall I add it?"),
        msgText("chat_alice_028", "incoming", jan(10, 8, 28), "Yes please, thank you!"),
        msgText("chat_alice_029", "outgoing", jan(10, 8, 30), "Done — late checkout confirmed."),

        // Jan 14
        msgText("chat_alice_030", "incoming", jan(14, 7, 45), "Is the gym open early?"),
        msgText("chat_alice_031", "outgoing", jan(14, 7, 48), "Gym is open daily 06:00–22:00."),
        msgText("chat_alice_032", "incoming", jan(14, 18, 2), "Can we store luggage after checkout?"),
        msgText("chat_alice_033", "outgoing", jan(14, 18, 5), "Yes — complimentary luggage storage is available."),

        // Jan 18
        msgText("chat_alice_034", "incoming", jan(18, 9, 12), "Is the spa available tomorrow?"),
        msgText("chat_alice_035", "outgoing", jan(18, 9, 15), "Yes — spa opens at 08:00. Do you want to book an entry slot?"),
        msgImage("chat_alice_036", "outgoing", jan(18, 9, 16), IMG.spa, "Spa (sauna + relaxation lounge)"),
        msgText("chat_alice_037", "incoming", jan(18, 9, 22), "Just entry is fine. 10:00 for two people."),
        msgText("chat_alice_038", "outgoing", jan(18, 9, 25), "Booked: spa entry tomorrow at 10:00 for two."),

        // Jan 22
        msgText("chat_alice_039", "incoming", jan(22, 19, 12), "Any taxi recommendations for the airport?"),
        msgText("chat_alice_040", "outgoing", jan(22, 19, 15), "We can arrange a shuttle/taxi with fixed price. What pickup time do you need?"),

        // Jan 26 (LAST incoming => unread candidate)
        msgText("chat_alice_041", "incoming", jan(26, 20, 58), "Tomorrow 06:00 please, from the main entrance."),
        msgText("chat_alice_042", "outgoing", jan(26, 21, 2), "Booked: pickup 06:00 at the main entrance. Reception will confirm driver details."),
        msgText("chat_alice_043", "outgoing", jan(26, 21, 3), "Anything else we can help with tonight?"),
        msgText("chat_alice_044", "incoming", jan(26, 21, 10), "No, that’s all. Thank you so much!"),
    ]);

    const ben: ChatThread = thread("chat_ben", "Ben Carter", [
        // Jan 4
        msgText("chat_ben_001", "incoming", jan(4, 16, 10), "Hello, I’m traveling with a toddler. Do you have a crib?"),
        msgText("chat_ben_002", "outgoing", jan(4, 16, 12), "Yes, we can provide a crib at no extra cost. What’s your arrival date?"),
        msgText("chat_ben_003", "incoming", jan(4, 16, 14), "Jan 9th. Also: is the room climate control adjustable?"),
        msgText("chat_ben_004", "outgoing", jan(4, 16, 18), "Yes, thermostat is adjustable in-room. I’ll request a quieter room as well."),

        // Jan 5
        msgImage("chat_ben_005", "outgoing", jan(5, 10, 5), IMG.room, "Typical room setup (crib fits next to the bed)"),
        msgText("chat_ben_006", "incoming", jan(5, 10, 12), "Great. Can you recommend activities nearby for kids?"),
        msgText("chat_ben_007", "outgoing", jan(5, 10, 18), "Sure: indoor playroom on level 2, and the city aquarium is a 12-min taxi ride."),
        msgImage("chat_ben_008", "outgoing", jan(5, 10, 20), IMG.map, "Nearby attractions (aquarium + playground)"),

        // Jan 6
        msgText("chat_ben_009", "incoming", jan(6, 8, 25), "Do you have a kettle in the room?"),
        msgText("chat_ben_010", "outgoing", jan(6, 8, 28), "Yes — kettle and mugs are provided."),
        msgText("chat_ben_011", "incoming", jan(6, 18, 44), "Is there a microwave available for baby food?"),
        msgText("chat_ben_012", "outgoing", jan(6, 18, 47), "Yes — reception can heat food for you any time."),

        // Jan 8
        msgText("chat_ben_013", "incoming", jan(8, 20, 3), "Is it possible to get extra pillows?"),
        msgText("chat_ben_014", "outgoing", jan(8, 20, 7), "Yes — we’ll send two extra pillows."),

        // Jan 9
        msgText("chat_ben_015", "incoming", jan(9, 21, 40), "We just arrived. Where do we pick up the crib?"),
        msgText("chat_ben_016", "outgoing", jan(9, 21, 42), "No need — housekeeping will deliver it to your room in ~10 minutes."),
        msgText("chat_ben_017", "incoming", jan(9, 21, 55), "Thanks. Could we also get a baby bath?"),
        msgText("chat_ben_018", "outgoing", jan(9, 21, 58), "Yes — we can provide a small baby bath. Sending it now."),

        // Jan 10
        msgText("chat_ben_019", "incoming", jan(10, 7, 8), "Is there lactose-free milk at breakfast?"),
        msgText("chat_ben_020", "outgoing", jan(10, 7, 11), "Yes. We have lactose-free milk and oat milk."),
        msgText("chat_ben_021", "incoming", jan(10, 9, 35), "Where is the playroom exactly?"),
        msgText("chat_ben_022", "outgoing", jan(10, 9, 38), "Level 2, next to the lounge area. Reception can point you to the elevator."),

        // Jan 12
        msgText("chat_ben_023", "incoming", jan(12, 18, 5), "We forgot a small toy in the room. Can you check?"),
        msgText("chat_ben_024", "outgoing", jan(12, 18, 9), "Yes — can you describe it and confirm your room number?"),
        msgText("chat_ben_025", "incoming", jan(12, 18, 12), "Blue dinosaur plush, room 512."),
        msgText("chat_ben_026", "outgoing", jan(12, 18, 20), "Found it. We can keep it at reception or ship it to your address."),
        msgText("chat_ben_027", "incoming", jan(12, 18, 22), "Please keep at reception — we can pick it up tomorrow."),
        msgText("chat_ben_028", "outgoing", jan(12, 18, 24), "Done. Reception will have it labeled under Carter."),

        // Jan 14
        msgText("chat_ben_029", "incoming", jan(14, 8, 10), "Is late checkout possible today?"),
        msgText("chat_ben_030", "outgoing", jan(14, 8, 14), "Late checkout until 13:00 is possible. Shall I add it?"),
        msgText("chat_ben_031", "incoming", jan(14, 8, 16), "Yes please."),
        msgText("chat_ben_032", "outgoing", jan(14, 8, 18), "Confirmed."),

        // Jan 18
        msgText("chat_ben_033", "incoming", jan(18, 10, 40), "Do you have a step-free entrance for the stroller?"),
        msgText("chat_ben_034", "outgoing", jan(18, 10, 43), "Yes — main entrance is step-free and has automatic doors."),

        // Jan 22
        msgText("chat_ben_035", "incoming", jan(22, 17, 5), "Any recommendation for a quiet dinner spot with a child?"),
        msgText("chat_ben_036", "outgoing", jan(22, 17, 10), "Our restaurant is calm before 19:00; we can seat you away from the bar."),

        // Jan 26 (LAST incoming)
        msgText("chat_ben_037", "incoming", jan(26, 9, 12), "We’re checking out today. Can we leave luggage for a few hours?"),
        msgText("chat_ben_038", "outgoing", jan(26, 9, 14), "Yes — luggage storage is available until you return."),
        msgText("chat_ben_039", "outgoing", jan(26, 9, 15), "Just let reception know your name."),
        msgText("chat_ben_040", "incoming", jan(26, 9, 18), "Great, thanks!"),
        // extra messages to reach 44
        msgText("chat_ben_041", "incoming", jan(26, 12, 2), "We’re back to pick up luggage. Is the reception line busy?"),
        msgText("chat_ben_042", "outgoing", jan(26, 12, 4), "It’s quick right now — you can come anytime."),
        msgText("chat_ben_043", "outgoing", jan(26, 12, 5), "Safe travels!"),
        msgText("chat_ben_044", "incoming", jan(26, 12, 8), "Thank you 😊"),
    ]);

    const chloe: ChatThread = thread("chat_chloe", "Chloe Smith", [
        // Jan 7
        msgText("chat_chloe_001", "incoming", jan(7, 14, 2), "Hi, do you offer a spa package?"),
        msgText("chat_chloe_002", "outgoing", jan(7, 14, 6), "Yes — sauna + pool access, plus optional massage. What day would you like?"),
        msgText("chat_chloe_003", "incoming", jan(7, 14, 10), "Jan 11th afternoon. 2 people."),
        msgText("chat_chloe_004", "outgoing", jan(7, 14, 13), "Available. Would you prefer relaxation or deep tissue?"),
        msgImage("chat_chloe_005", "outgoing", jan(7, 14, 14), IMG.spa, "Spa area (sauna + lounge)"),
        msgText("chat_chloe_006", "incoming", jan(7, 14, 16), "Relaxation massage for both, please."),
        msgText("chat_chloe_007", "outgoing", jan(7, 14, 20), "Booked: Jan 11th, spa entry 15:00, massages 16:00–17:00."),

        // Jan 9
        msgText("chat_chloe_008", "incoming", jan(9, 9, 5), "Do you have strong Wi-Fi in meeting areas?"),
        msgText("chat_chloe_009", "outgoing", jan(9, 9, 9), "Yes — dedicated business network is available."),

        // Jan 11
        msgText("chat_chloe_010", "incoming", jan(11, 12, 33), "Can we reschedule to 17:00? We’re running late."),
        msgText("chat_chloe_011", "outgoing", jan(11, 12, 36), "Yes — I can move spa entry to 16:00 and massages to 17:00. Confirm?"),
        msgText("chat_chloe_012", "incoming", jan(11, 12, 37), "Confirmed, thank you."),

        // Jan 13
        msgText("chat_chloe_013", "incoming", jan(13, 8, 40), "Can you recommend a quiet area for a call?"),
        msgText("chat_chloe_014", "outgoing", jan(13, 8, 44), "Lobby corner near the plants is usually quiet before 10:00."),
        msgImage("chat_chloe_015", "outgoing", jan(13, 8, 45), IMG.lobby, "Quiet lobby corner (outlets nearby)"),

        // Jan 15
        msgText("chat_chloe_016", "incoming", jan(15, 9, 5), "Do you have meeting rooms? Need something small for 6 people."),
        msgText("chat_chloe_017", "outgoing", jan(15, 9, 11), "Yes. We have a 6–8 person boardroom with screen + HDMI. What time range?"),
        msgText("chat_chloe_018", "incoming", jan(15, 9, 15), "10:00–12:00 on Jan 18th."),
        msgText("chat_chloe_019", "outgoing", jan(15, 9, 19), "Booked: Boardroom, Jan 18th 10:00–12:00. Coffee/tea included."),

        // Jan 16
        msgText("chat_chloe_020", "incoming", jan(16, 16, 30), "Can we add water bottles to the room for tomorrow?"),
        msgText("chat_chloe_021", "outgoing", jan(16, 16, 35), "Yes — I’ll arrange still water in the boardroom and room."),

        // Jan 18
        msgText("chat_chloe_022", "incoming", jan(18, 12, 5), "Where can we print documents?"),
        msgText("chat_chloe_023", "outgoing", jan(18, 12, 7), "Reception can print for you. Email the file or bring it on a USB stick."),
        msgText("chat_chloe_024", "incoming", jan(18, 12, 9), "Perfect. I’ll email it now."),
        msgText("chat_chloe_025", "outgoing", jan(18, 12, 11), "Got it — we’ll print and have it ready at reception."),

        // Jan 20
        msgText("chat_chloe_026", "incoming", jan(20, 9, 18), "Can we extend the room for 1 more night?"),
        msgText("chat_chloe_027", "outgoing", jan(20, 9, 22), "Yes — extension is available. Same room category, same rate."),
        msgText("chat_chloe_028", "incoming", jan(20, 9, 25), "Great, please extend."),

        // Jan 22
        msgText("chat_chloe_029", "outgoing", jan(22, 10, 0), "Confirmed — booking extended by 1 night."),
        msgText("chat_chloe_030", "incoming", jan(22, 10, 6), "Thank you."),

        // Jan 24
        msgText("chat_chloe_031", "incoming", jan(24, 18, 10), "Is there a quiet breakfast time to avoid crowds?"),
        msgText("chat_chloe_032", "outgoing", jan(24, 18, 13), "Usually 07:00–08:00 is the quietest."),

        // Jan 26 (LAST incoming)
        msgText("chat_chloe_033", "incoming", jan(26, 11, 10), "We’re leaving today. Can we get an invoice copy by email?"),
        msgText("chat_chloe_034", "outgoing", jan(26, 11, 13), "Yes — please share your email address and we’ll send it shortly."),
        msgText("chat_chloe_035", "incoming", jan(26, 11, 14), "chloe.smith@example.com"),
        msgText("chat_chloe_036", "outgoing", jan(26, 11, 16), "Sent. Let us know if anything needs adjustment."),
        // extra to reach 44
        msgText("chat_chloe_037", "outgoing", jan(26, 11, 20), "Safe travels!"),
        msgText("chat_chloe_038", "incoming", jan(26, 11, 22), "Thanks — everything was great."),
        msgText("chat_chloe_039", "incoming", jan(26, 12, 40), "One last thing: can you confirm the checkout time?"),
        msgText("chat_chloe_040", "outgoing", jan(26, 12, 42), "Checkout is at 12:00, but late checkout was available on request."),
        msgText("chat_chloe_041", "incoming", jan(26, 12, 44), "We’re already out. All good."),
        msgText("chat_chloe_042", "outgoing", jan(26, 12, 46), "Great — thank you for staying with us."),
        msgText("chat_chloe_043", "outgoing", jan(26, 12, 47), "Hope to see you again."),
        msgText("chat_chloe_044", "incoming", jan(26, 12, 49), "Likewise 😊"),
    ]);

    const david: ChatThread = thread("chat_david", "David Tan", [
        // Jan 3
        msgText("chat_david_001", "incoming", jan(3, 8, 45), "Morning — is early check-in possible today?"),
        msgText("chat_david_002", "outgoing", jan(3, 8, 49), "We can offer early check-in from 11:00 if the room is ready. What’s your booking name?"),
        msgText("chat_david_003", "incoming", jan(3, 8, 52), "Tan. Also, can you store luggage if it’s not ready?"),
        msgText("chat_david_004", "outgoing", jan(3, 8, 54), "Yes, luggage storage is available at reception."),
        msgText("chat_david_005", "incoming", jan(3, 10, 32), "Any good coffee nearby?"),
        msgText("chat_david_006", "outgoing", jan(3, 10, 36), "Two recommendations: North Brew (5 min walk) and Corner Roasters (8 min walk)."),
        msgImage("chat_david_007", "outgoing", jan(3, 10, 38), IMG.map, "Coffee spots map (walking routes)"),

        // Jan 5
        msgText("chat_david_008", "incoming", jan(5, 9, 5), "Do you have a quiet place for video calls?"),
        msgText("chat_david_009", "outgoing", jan(5, 9, 8), "Lobby corner is quiet until 17:00; mezzanine is quieter in the evening."),
        msgImage("chat_david_010", "outgoing", jan(5, 9, 9), IMG.lobby, "Quiet corner seating"),

        // Jan 8
        msgText("chat_david_011", "incoming", jan(8, 19, 10), "Our room is a bit warm. Can someone check the AC?"),
        msgText("chat_david_012", "outgoing", jan(8, 19, 12), "Sure — maintenance can come in ~15 minutes. Is now okay?"),
        msgText("chat_david_013", "incoming", jan(8, 19, 13), "Yes, please."),
        msgText("chat_david_014", "outgoing", jan(8, 19, 40), "Maintenance confirmed the thermostat is working; vents adjusted for stronger cooling."),

        // Jan 11
        msgText("chat_david_015", "incoming", jan(11, 7, 20), "Can I get an extra blanket?"),
        msgText("chat_david_016", "outgoing", jan(11, 7, 23), "Yes — we’ll send one up shortly."),

        // Jan 14
        msgText("chat_david_017", "incoming", jan(14, 18, 55), "Is the restaurant open late?"),
        msgText("chat_david_018", "outgoing", jan(14, 18, 58), "Kitchen closes at 22:00. Bar snacks available later."),

        // Jan 16
        msgText("chat_david_019", "incoming", jan(16, 9, 40), "Do you have ironing services?"),
        msgText("chat_david_020", "outgoing", jan(16, 9, 43), "Yes — laundry/ironing can be arranged via reception."),

        // Jan 18
        msgText("chat_david_021", "incoming", jan(18, 13, 12), "Can we get two water bottles delivered?"),
        msgText("chat_david_022", "outgoing", jan(18, 13, 15), "Sure — sending now."),

        // Jan 20
        msgText("chat_david_023", "incoming", jan(20, 13, 5), "Can you recommend a quiet workspace in the hotel?"),
        msgText("chat_david_024", "outgoing", jan(20, 13, 9), "Lobby corner is quiet until 17:00. After that, mezzanine is better."),
        msgImage("chat_david_025", "outgoing", jan(20, 13, 10), IMG.lobby, "Workspace corner (outlets nearby)"),

        // Jan 22
        msgText("chat_david_026", "incoming", jan(22, 8, 35), "Is breakfast served from 07:00?"),
        msgText("chat_david_027", "outgoing", jan(22, 8, 38), "Yes — 07:00 to 10:30."),
        msgImage("chat_david_028", "outgoing", jan(22, 8, 40), IMG.breakfast, "Breakfast options"),

        // Jan 24
        msgText("chat_david_029", "incoming", jan(24, 9, 55), "Do you have an airport shuttle?"),
        msgText("chat_david_030", "outgoing", jan(24, 9, 58), "We can arrange a shuttle (fixed price). What pickup time do you need?"),
        msgText("chat_david_031", "incoming", jan(24, 10, 2), "06:00 tomorrow."),
        msgText("chat_david_032", "outgoing", jan(24, 10, 6), "Booked: shuttle pickup 06:00 at the main entrance."),

        // Jan 26 (LAST incoming)
        msgText("chat_david_033", "incoming", jan(26, 8, 10), "Can I get a wake-up call at 05:30?"),
        msgText("chat_david_034", "outgoing", jan(26, 8, 12), "Yes — wake-up call scheduled for 05:30."),
        // extra to reach 44
        msgText("chat_david_035", "incoming", jan(26, 8, 40), "Also: where do I find the invoice in the booking?"),
        msgText("chat_david_036", "outgoing", jan(26, 8, 43), "Reception can print or email it. Which do you prefer?"),
        msgText("chat_david_037", "incoming", jan(26, 8, 44), "Email please."),
        msgText("chat_david_038", "outgoing", jan(26, 8, 46), "Sure — please share your email address."),
        msgText("chat_david_039", "incoming", jan(26, 8, 47), "d.tan@example.com"),
        msgText("chat_david_040", "outgoing", jan(26, 8, 49), "Sent. Safe travels!"),
        msgText("chat_david_041", "outgoing", jan(26, 8, 50), "Let us know if anything is missing."),
        msgText("chat_david_042", "incoming", jan(26, 8, 55), "All good. Thanks for the quick support."),
        msgText("chat_david_043", "outgoing", jan(26, 8, 56), "You’re welcome!"),
        msgText("chat_david_044", "incoming", jan(26, 8, 58), "Bye 😊"),
    ]);

    return [alice, ben, chloe, david];
}