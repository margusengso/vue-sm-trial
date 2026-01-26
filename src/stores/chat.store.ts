import { defineStore } from "pinia";
import type { ChatMessage, ChatThread } from "../types/chat";
import { makeMockThreads } from "../mock/threads";

type RuntimeThread = {
    thread: ChatThread;

    // pagination state
    loaded: ChatMessage[];
    cursorStart: number; // index in allMessages for the first loaded msg
    isLoadingOlder: boolean;

    // unread state (requirement)
    unreadMessageId: string | null;
    unreadCount: number;

    // forces MessageList to scroll (send / select / etc.)
    scrollToken: number;
};

type ChatSummary = {
    id: string;
    title: string;
    subtitle: string;
    lastMessageAt: number;
    unreadCount: number;
};

function last<T>(arr: T[]): T | undefined {
    return arr.length ? arr[arr.length - 1] : undefined;
}

function computeInitialUnread(thread: ChatThread) {
    const lm = last(thread.allMessages);
    if (!lm) return { unreadMessageId: null as string | null, unreadCount: 0 };

    if (lm.direction === "incoming") {
        return { unreadMessageId: lm.id, unreadCount: 1 };
    }
    return { unreadMessageId: null as string | null, unreadCount: 0 };
}

export const useChatStore = defineStore("chat", {
    state: () => ({
        threadsById: {} as Record<string, RuntimeThread>,
        activeChatId: "" as string,
        sidebarOpen: true,
    }),

    getters: {
        summaries(state): ChatSummary[] {
            return Object.values(state.threadsById)
                .map((rt) => {
                    const lm = last(rt.thread.allMessages);
                    return {
                        id: rt.thread.id,
                        title: rt.thread.title,
                        subtitle: rt.thread.subtitle,
                        lastMessageAt: lm?.createdAt ?? 0,
                        unreadCount: rt.unreadCount,
                    };
                })
                .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
        },

        active(state): RuntimeThread | null {
            return state.activeChatId ? state.threadsById[state.activeChatId] ?? null : null;
        },

        activeTitle(): string {
            return this.active?.thread.title ?? "";
        },
        activeSubtitle(): string {
            return this.active?.thread.subtitle ?? "";
        },

        activeLoaded(): ChatMessage[] {
            return this.active?.loaded ?? [];
        },

        activeHasMoreOlder(): boolean {
            const rt = this.active;
            if (!rt) return false;
            return rt.cursorStart > 0;
        },

        activeIsLoadingOlder(): boolean {
            return this.active?.isLoadingOlder ?? false;
        },

        activeUnreadMessageId(): string | null {
            return this.active?.unreadMessageId ?? null;
        },

        activeScrollToken(): number {
            return this.active?.scrollToken ?? 0;
        },
    },

    actions: {
        init() {
            const threads = makeMockThreads();

            const map: Record<string, RuntimeThread> = {};
            for (const t of threads) {
                const { unreadMessageId, unreadCount } = computeInitialUnread(t);

                // initial load: last 20
                const total = t.allMessages.length;
                const batch = 20;
                const start = Math.max(0, total - batch);

                map[t.id] = {
                    thread: t,
                    loaded: t.allMessages.slice(start, total),
                    cursorStart: start,
                    isLoadingOlder: false,

                    unreadMessageId,
                    unreadCount,

                    scrollToken: 0,
                };
            }

            this.threadsById = map;

            // pick first (or most recent)
            const first = this.summaries[0]?.id;
            if (first) this.setActiveChat(first);
        },

        toggleSidebar(open: boolean) {
            this.sidebarOpen = open;
        },

        setActiveChat(id: string) {
            this.activeChatId = id;

            // force MessageList to scroll to bottom on chat select
            const rt = this.threadsById[id];
            if (rt) rt.scrollToken++;
        },

        async loadOlderBatch() {
            const rt = this.active;
            if (!rt) return;
            if (rt.isLoadingOlder) return;
            if (rt.cursorStart <= 0) return;

            rt.isLoadingOlder = true;

            // mock async
            await new Promise((r) => setTimeout(r, 250));

            const batch = 20;
            const newStart = Math.max(0, rt.cursorStart - batch);
            const older = rt.thread.allMessages.slice(newStart, rt.cursorStart);

            rt.loaded = [...older, ...rt.loaded];
            rt.cursorStart = newStart;
            rt.isLoadingOlder = false;
        },


        clearUnreadIfNeeded(unreadId: string) {
            const rt = this.active;
            if (!rt) return;
            if (!rt.unreadMessageId) return;
            if (rt.unreadMessageId !== unreadId) return;

            rt.unreadMessageId = null;
            rt.unreadCount = 0;
        },


        sendText(text: string) {
            const rt = this.active;
            if (!rt) return;

            const id = `${rt.thread.id}_${Date.now()}`;
            const msg: ChatMessage = {
                id,
                type: "text",
                direction: "outgoing",
                createdAt: Date.now(),
                text,
            } as ChatMessage;

            rt.thread.allMessages.push(msg);

            // keep loaded at bottom, append to loaded
            rt.loaded = [...rt.loaded, msg];

            // unread must be cleared because last message is outgoing now
            rt.unreadMessageId = null;
            rt.unreadCount = 0;

            // force MessageList to scroll (your scrollToken watcher)
            rt.scrollToken++;
        },

        sendImage(url: string, caption?: string) {
            const rt = this.active;
            if (!rt) return;

            const id = `${rt.thread.id}_${Date.now()}`;
            const msg: ChatMessage = {
                id,
                type: "image",
                direction: "outgoing",
                createdAt: Date.now(),
                url,
                caption,
            } as ChatMessage;

            rt.thread.allMessages.push(msg);
            rt.loaded = [...rt.loaded, msg];

            rt.unreadMessageId = null;
            rt.unreadCount = 0;

            rt.scrollToken++;
        },
    },
});