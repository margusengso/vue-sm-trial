import type { MessageType } from "../../../types/chat";
import TextMessage from "./TextMessage.vue";
import ImageMessage from "./ImageMessage.vue";

export const messageRegistry: Record<MessageType, any> = {
    text: TextMessage,
    image: ImageMessage,
};