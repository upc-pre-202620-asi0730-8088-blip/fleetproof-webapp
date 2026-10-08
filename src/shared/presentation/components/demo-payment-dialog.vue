<script setup>
import {ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
const props = defineProps({visible:Boolean, busy:Boolean, title:String, description:String, error:String});
const emit = defineEmits(['update:visible', 'confirm']);
const {t} = useI18n();
const qr = ref(''), generating = ref(false), qrError = ref('');
watch(() => props.visible, () => {qr.value = ''; qrError.value = '';});
async function showQr() {
  generating.value = true; qrError.value = '';
  try {
    const {default: QRCode} = await import('qrcode');
    const data = await QRCode.toDataURL('FLEETPROOF DEMO ONLY - NOT A PAYMENT CODE', {width:240, margin:2});
    if (props.visible) qr.value = data;
  } catch {qrError.value = t('common.error');}
  finally {generating.value = false;}
}
</script>
<template>
  <pv-dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal :header="title" class="form-dialog" :closable="!busy" :close-on-escape="!busy" :dismissable-mask="false">
    <div class="payment-demo">
      <pv-tag :value="t('paymentUi.demo')" severity="warn" />
      <p>{{ description }}</p><p class="secondary">{{ t('paymentUi.notice') }}</p>
      <pv-button v-if="!qr" icon="pi pi-qrcode" :label="t('paymentUi.showQr')" :loading="generating" @click="showQr" />
      <figure v-if="qr" class="demo-qr"><img :src="qr" :alt="t('paymentUi.qrAlt')" width="240" height="240" /><figcaption>{{ t('paymentUi.notPayment') }}</figcaption></figure>
      <pv-message v-if="error || qrError" severity="error">{{ error || qrError }}</pv-message>
      <div class="form-actions"><pv-button :label="t('common.cancel')" outlined :disabled="busy" @click="emit('update:visible', false)" /><pv-button v-if="qr" icon="pi pi-check" :label="t('paymentUi.confirm')" :loading="busy" @click="emit('confirm')" /></div>
    </div>
  </pv-dialog>
</template>
