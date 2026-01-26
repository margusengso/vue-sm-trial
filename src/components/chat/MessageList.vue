
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import type { ChatMessage } from "../../types/chat";
import { isSameDay, dayLabel } from "../../utils/dates";
import MessageRow from "./MessageRow.vue";

const props = defineProps<{
  chatId: string;
  messages: ChatMessage[];
  unreadMessageId: string | null;
  hasMoreOlder: boolean;
  isLoadingOlder: boolean;
  scrollToken: number;
}>();

const emit = defineEmits<{
  (e: "load-older"): void;
  (e: "seen-unread", id: string): void;
}>();

const scroller = ref<HTMLElement | null>(null);
const topSentinel = ref<HTMLElement | null>(null);
const bottomSentinel = ref<HTMLElement | null>(null);

const didInitialScroll = ref(false);

/**
 * Arm infinite scroll only after initial autoscroll settles.
 */
const canLoadOlder = ref(false);
let armTimer: number | null = null;

function disarmLoadOlder() {
  canLoadOlder.value = false;
  if (armTimer != null) {
    window.clearTimeout(armTimer);
    armTimer = null;
  }
}
function armLoadOlderAfterInitialScroll() {
  disarmLoadOlder();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      armTimer = window.setTimeout(() => {
        canLoadOlder.value = true;
        armTimer = null;
      }, 220);
    });
  });
}

/**
 * Prevent visible jump during prepend.
 */
const suspendPaint = ref(false);
const pendingAdjust = ref<{ oldHeight: number; oldTop: number } | null>(null);

function isAtBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < 24;
}

function scrollToBottom(behavior: ScrollBehavior = "auto") {
  const el = scroller.value;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior });
}

/** bottom lock (hard pin) while layout settles */
let lockUntil = 0;
let lockActive = false;
let lockRaf: number | null = null;

function startBottomLock(ms = 700) {
  lockUntil = Date.now() + ms;
  lockActive = true;

  if (lockRaf != null) cancelAnimationFrame(lockRaf);

  scrollToBottom("auto");

  const tick = () => {
    const el = scroller.value;
    if (!el) return;

    if (!lockActive) {
      lockRaf = null;
      return;
    }

    if (Date.now() < lockUntil) {
      scrollToBottom("auto");
      lockRaf = requestAnimationFrame(tick);
    } else {
      lockActive = false;
      lockRaf = null;
    }
  };

  lockRaf = requestAnimationFrame(tick);
}

function extendBottomLock(ms = 500) {
  lockActive = true;
  lockUntil = Math.max(lockUntil, Date.now() + ms);

  if (lockRaf == null) {
    const tick = () => {
      const el = scroller.value;
      if (!el) return;

      if (!lockActive) {
        lockRaf = null;
        return;
      }

      if (Date.now() < lockUntil) {
        scrollToBottom("auto");
        lockRaf = requestAnimationFrame(tick);
      } else {
        lockActive = false;
        lockRaf = null;
      }
    };
    lockRaf = requestAnimationFrame(tick);
  }

  scrollToBottom("auto");
}

function stopBottomLock() {
  lockActive = false;
  if (lockRaf != null) {
    cancelAnimationFrame(lockRaf);
    lockRaf = null;
  }
}

onBeforeUnmount(() => {
  stopBottomLock();
  disarmLoadOlder();
});

function onMediaLoaded() {
  if (lockActive) scrollToBottom("auto");
}

const rows = computed(() =>
    props.messages.map((m, idx) => {
      const prev = props.messages[idx - 1];
      return {
        message: m,
        showDateDivider: !prev || !isSameDay(prev.createdAt, m.createdAt),
        dateLabel: dayLabel(m.createdAt),
        showUnreadDivider: props.unreadMessageId === m.id,
      };
    })
);

/** Chat switch: hard bottom + arm older-load */
watch(
    () => props.chatId,
    async () => {
      didInitialScroll.value = false;
      disarmLoadOlder();

      suspendPaint.value = false;

      await nextTick();
      await nextTick();

      requestAnimationFrame(() => {
        startBottomLock(850);
        armLoadOlderAfterInitialScroll();
        didInitialScroll.value = true;
      });
    }
);

/** Send: keep pinned (hard) */
watch(
    () => props.scrollToken,
    async () => {

      await nextTick();
      await nextTick();

      requestAnimationFrame(() => requestAnimationFrame(() => extendBottomLock(700)));
    }
);

/** Initial async load + append behavior */
watch(
    () => props.messages.length,
    async (len, prev) => {
      if (len === 0) return;

      // First batch after mount (or after switching chat, store loads async)
      if (!didInitialScroll.value) {
        disarmLoadOlder();

        suspendPaint.value = false;

        await nextTick();
        await nextTick();

        requestAnimationFrame(() => {
          startBottomLock(750);
          armLoadOlderAfterInitialScroll();
          didInitialScroll.value = true;
        });

        return;
      }

      // ignore while prepending older
      if (props.isLoadingOlder) return;

      const el = scroller.value;
      const wasAtBottom = el ? isAtBottom(el) : false;

      // Follow-up appends: hard only
      if (len > prev && wasAtBottom) {
        await nextTick();
        startBottomLock(450);
      }
    }
);

/** Infinite scroll trigger (top) */
useIntersectionObserver(
    topSentinel,
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      if (!canLoadOlder.value) return;
      if (!props.hasMoreOlder || props.isLoadingOlder) return;

      const el = scroller.value;
      if (!el) return;

      stopBottomLock();

      suspendPaint.value = true;

      pendingAdjust.value = { oldHeight: el.scrollHeight, oldTop: el.scrollTop };
      emit("load-older");
    },
    { root: scroller, threshold: 0.01 }
);

/** After prepend completes, restore scrollTop BEFORE unfreezing paint */
watch(
    () => props.isLoadingOlder,
    async (loading, prev) => {
      if (loading) return;
      if (prev !== true) return;

      const el = scroller.value;
      const snap = pendingAdjust.value;

      if (!el || !snap) {
        pendingAdjust.value = null;
        suspendPaint.value = false;

        return;
      }

      await nextTick();
      const newHeight = el.scrollHeight;

      el.scrollTop = snap.oldTop + (newHeight - snap.oldHeight);
      pendingAdjust.value = null;

      requestAnimationFrame(() => {
        suspendPaint.value = false;

      });
    }
);

/** Unread clearing */
useIntersectionObserver(
    bottomSentinel,
    ([entry]) => {
      if (entry?.isIntersecting && props.unreadMessageId) {
        emit("seen-unread", props.unreadMessageId);
      }
    },
    { root: scroller, threshold: 0.75 }
);

function onScroll() {
  const el = scroller.value;
  if (!el) return;

  if (!isAtBottom(el)) stopBottomLock();

  if (props.unreadMessageId && isAtBottom(el)) {
    emit("seen-unread", props.unreadMessageId);
  }
}
</script>

<template>
  <div
      ref="scroller"
      class="bg-white px-2.5 py-2.5 overflow-auto h-full min-h-0"
      :class="suspendPaint ? 'ml-freeze' : ''"
      @scroll.passive="onScroll"
  >
    <div ref="topSentinel" class="h-5 flex items-center justify-center">
      <span v-if="isLoadingOlder" class="text-[11px] text-neutral-500">Loading…</span>
    </div>


    <div >
      <div v-for="r in rows" :key="r.message.id">
        <MessageRow
            :message="r.message"
            :show-date-divider="r.showDateDivider"
            :date-label="r.dateLabel"
            :show-unread-divider="r.showUnreadDivider"
            @media-loaded="onMediaLoaded"
        />
      </div>
    </div>

    <div ref="bottomSentinel" class="h-px" />
  </div>
</template>

<style scoped>
.msg-enter-active {
  transition: all 180ms ease;
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.ml-freeze {
  /*visibility: hidden;*/
  opacity: .69;
}
</style>