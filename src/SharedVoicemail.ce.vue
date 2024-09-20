<template>
  <div id="shared-voicemail" :class="setTheme" :disabled="disableBtn" @click="makeCall">
    <div class="btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-voicemail" viewBox="0 0 16 16">
        <path
          d="M7 8.5A3.5 3.5 0 0 1 5.95 11h4.1a3.5 3.5 0 1 1 2.45 1h-9A3.5 3.5 0 1 1 7 8.5m-6 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0m14 0a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0" />
      </svg>
      <span v-if="messageCount" class="badge">
        <span class="badge-text">{{ messageCount }}</span>
      </span>
    </div>
  </div>
</template>


<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'
import { Desktop } from '@wxcc-desktop/sdk'

let unsubscribe = null
const messageCount = ref(0)
const disableBtn = false
const logger = Desktop.logger.createLogger('shared-voicemail')


const props = defineProps({
  darkmode: String,
  webhookname: String,
  voicemaildn: String,
  voicemailpilot: String,
  entrypointid: String,
})


const setTheme = computed(() => ({
  'dark': props.darkmode === 'true',
  'light': props.darkmode === 'false'
}))


const initDesktop = async () => {
  logger.info('Initializing WxCC Desktop SDK...')
  await Desktop.config.init('shared-voicemail', 'dwfinnegan')
}


const initFirebase = () => {
  logger.info('Initializing Firebase SDK...')

  unsubscribe = onSnapshot(doc(db, 'sharedVoicemail', props.webhookname), (snap) => {
    const data = snap.data()
    messageCount.value = data.newMessages + data.newUrgentMessages
    logger.info(`Firebase snapshot updated message count: ${messageCount.value}`)
  })
}


const makeCall = async () => {
  try {
    await Desktop.dialer.startOutdial({
      data: {
        entryPointId: props.entrypointid,
        destination: props.voicemailpilot,
        direction: "OUTBOUND",
        origin: props.voicemaildn,
        attributes: {},
        mediaType: "telephony",
        outboundType: "OUTDIAL"
      }
    })
    logger.info(`makeCall Success: Call placed to voicemail pilot number`)
  } catch (error) {
    logger.info(`makeCall Failed: An error occurred, check POST for more info`)
  }
}


onMounted(() => {
  initDesktop()
  initFirebase()
})


onUnmounted(() => {
  unsubscribe()
})
</script>


<style scoped>
*,
*::after,
*::before {
  border: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

#shared-voicemail.light {
  --text: #131313;
  --btn: #dedede;
  --hover: #929292;
  --badge-bg: #d4371c;
  --badge-text: #ffffff;
}

#shared-voicemail.dark {
  --text: #f7f7f7;
  --hover: #929292;
  --btn: #3b3b3b;
  --badge-bg: #d4371c;
  --badge-text: #ffffff;
}

.btn {
  height: 32px;
  width: 32px;
  background-color: var(--btn);
  border-radius: 20%;
  padding-top: 8px;
  text-align: center;
  position: relative;
}

.btn:hover {
  background-color: var(--hover);
  cursor: pointer;
}

.btn:disabled {
  cursor: none;
}

.btn svg {
  fill: var(--text);
}

.badge {
  background-color: var(--badge-bg);
  height: 18px;
  width: 18px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-text {
  color: var(--badge-text);
  height: 16px;
  line-height: 16px;
  font-size: 12px;
}
</style>
