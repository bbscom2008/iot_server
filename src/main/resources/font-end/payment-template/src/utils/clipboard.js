import Vue from 'vue'
import Clipboard from 'clipboard'
import Message from '@/utils/message'

function clipboardSuccess(text) {
  Message.success({
    message: '复制成功 '+text,
    duration: 1500
  })
}

function clipboardError() {
  Message.error({
    message: '复制失败'
  })
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.currentTarget, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(text)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
