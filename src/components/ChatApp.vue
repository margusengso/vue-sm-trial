
<script setup lang="ts">
import { onMounted } from "vue";
import { useChatStore } from "../stores/chat.store";
import ChatList from "./sidebar/ChatList.vue";
import ChatShell from "./chat/ChatShell.vue";

const store = useChatStore();
onMounted(() => store.init());

</script>

<template>
  <div class="h-screen overflow-hidden bg-appbg flex flex-col font-lato">
    <header class="h-14 bg-topbar text-white shrink-0">
      <div class="h-full max-w-[1180px] mx-auto px-3 flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">

          <img
              src="/src/assets/sm-brand-logo-logomark.png"
              alt="SiteMinder"
              class="w-10 h-10 cursor-pointer"
              draggable="false"
          />
          <div class="font-lato">
            SiteMinder <span class="opacity-90 font-thin">| Guest Engagement</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
              v-if="!store.sidebarOpen"
              type="button"
              class="md:hidden h-7 px-2 rounded border border-white/30 bg-white/15 text-xs"
              @click="store.toggleSidebar(true)"
          >
            Chats
          </button>


          <img
              src="/src/assets/person_icon2.png"
              alt="User"
              class="w-7 h-7 rounded-full bg-white/10 cursor-pointer"
              draggable="false"
          />
        </div>
      </div>
    </header>


    <div class="flex-1 min-h-0">
      <div class="max-w-[1180px] mx-auto h-full px-3 py-4 md:py-5">
        <div class="h-full min-h-0 grid md:grid-cols-[320px_1fr] gap-3 items-stretch">
          <!-- Sidebar -->
          <aside
              class="bg-white border border-neutral-200 shadow-card overflow-hidden md:rounded-sm
                   fixed top-14 bottom-0 left-0 w-[min(92vw,360px)] z-20 transition-transform duration-150
                   md:static md:transform-none md:w-auto md:h-full"
              :class="store.sidebarOpen ? 'translate-x-0' : '-translate-x-[105%] md:translate-x-0'"
          >
            <div class="h-full min-h-0 overflow-auto">
              <ChatList
                  :items="store.summaries"
                  :active-id="store.activeChatId"
                  @select="store.setActiveChat"
                  @close="store.toggleSidebar(false)"
              />
            </div>
          </aside>

          <!-- Main -->
          <main class="min-h-0 h-full flex items-stretch justify-start">
            <div class="w-full h-full min-h-0 overflow-hidden">
              <ChatShell />
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Mobile backdrop -->
    <div
        v-if="store.sidebarOpen"
        class="md:hidden fixed top-14 left-0 right-0 bottom-0 bg-black/25 z-10"
        @click="store.toggleSidebar(false)"
    />
  </div>
</template>