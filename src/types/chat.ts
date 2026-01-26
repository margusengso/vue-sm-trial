export type MessageDirection = "incoming" | "outgoing";

export type MessageBase = {
    id: string;
    direction: MessageDirection;
    createdAt: number;
};

export type TextMessage = MessageBase & {
    type: "text";
    text: string;
};

export type ImageMessage = MessageBase & {
    type: "image";
    url: string;
    caption?: string;
};

export type ChatMessage = TextMessage | ImageMessage;
export type MessageType = ChatMessage["type"];

export type ChatThread = {
    id: string;
    title: string;
    subtitle: string;
    allMessages: ChatMessage[];
};

export type ChatSummary = {
    id: string;
    title: string;
    subtitle: string;
    lastMessageAt: number;
    unreadCount: number;
};