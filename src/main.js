import { defineCustomElement } from 'vue'
import SharedVoicemail from './SharedVoicemail.ce.vue'

const component = defineCustomElement(SharedVoicemail)

customElements.define("shared-voicemail", component)


