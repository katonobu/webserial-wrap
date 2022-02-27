// MIT License
//
// Copyright (c) 2021-2022 Nobuo Kato (katonobu4649@gmail.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import webSerialWrap from './webserial_wrap.js'

// eslint-disable-next-line no-undef
const term = new Terminal({
  scrollback: 10_000
})

document.addEventListener('DOMContentLoaded', async () => {
  // eslint-disable-next-line no-undef
  const { openPort, closePort, sendMessage, updateCallbacks } = webSerialWrap()
  let isConnected = false

  // UI
  const terminalElement = document.getElementById('terminal')
  if (terminalElement) {
    term.open(terminalElement)
  }

  const sendButton = document.getElementById('send')
  sendButton.addEventListener('click', async () => {
    if (isConnected) {
      const sendStr = '< TEST RSP 500'
      sendMessage(new TextEncoder().encode(sendStr + '\r\n'))
      term.writeln(sendStr)
    }
  })

  const connectButton = document.getElementById('connect')
  connectButton.addEventListener('click', () => {
    if (isConnected) {
      closePort()
    } else {
      openPort()
    }
  })

  updateCallbacks({
    onOpen: () => {
      console.log('onOpen()')
      isConnected = true
      connectButton.textContent = 'CLOSE'
      sendButton.disabled = false
    },
    onClose: () => {
      console.log('onClose()')
      isConnected = false
      connectButton.textContent = 'OPEN'
      sendButton.disabled = true
    },
    onMessage: (msg) => {
      const decoder = new TextDecoder()
      const decoded = decoder.decode(msg)
      console.log(decoded)
      term.writeln(decoded)
    },
    onError: (e) => {
      console.log(e)
    }
  })
})
