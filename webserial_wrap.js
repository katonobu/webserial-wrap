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

const webSerialWrap = (() => {
  let port
  let reader
  return () => {
    let _onOpen = () => {
      console.log('OnOpen()')
    }
    let _onClose = () => {
      console.log('OnClose()')
    }
    let _onMessage = (msg) => {
      console.log('OnMessage(', msg, ')')
    }
    let _onError = (e) => {
      console.log(e)
    }

    console.log('webSerialIo() is called')

    const updateCallbacks = ({ onOpen, onClose, onMessage, onError }) => {
      if (onOpen) {
        _onOpen = onOpen
      }
      if (onClose) {
        _onClose = onClose
      }
      if (onMessage) {
        _onMessage = onMessage
      }
      if (onError) {
        _onError = onError
      }
    }

    const markDisconnected = () => {
      //        console.log('markDisconnected is called');
      port = undefined
      _onClose()
    }

    // type openPort = (port: SerialPort, options: SerialOptions) => Promise<void>;
    const openPort = async (requestPortFilters, openOptions) => {
      // requestPortFilters may like this [{usbVendorId:0x2341, usbProductId:0x8054}]
      // default value, [] accepts all vid/pid.
      const filters = requestPortFilters || []
      try {
        const tmpPort = await navigator.serial.requestPort({
          filters: filters
        })
        const options = openOptions || {
          baudRate: 115200,
          dataBits: 8,
          stopBits: 1,
          parity: 'none',
          bufferSize: 255,
          flowControl: 'none'
        }
        try {
          await tmpPort.open(options)
          port = tmpPort
          _onOpen()

          // eslint-disable-next-line no-unmodified-loop-condition
          while (port && port.readable) {
            try {
              reader = port.readable.getReader()
              for (;;) {
                //                    console.log('before reader.current.read()');
                const { value, done } = await reader.read()
                //                    console.log('return from reader.current.read()');
                if (value) {
                  _onMessage(value)
                }
                if (done) {
                  break
                }
              }
              reader.releaseLock()
              reader = undefined
            } catch (e) {
              _onError(e)
              break
            }
          }
          if (port) {
            try {
              await port.close()
              markDisconnected()
            } catch (e) {
              _onError(e)
            }
          }
        } catch (e) {
          _onError(e)
        }
      } catch (e) {
        _onError(e)
      }
    }

    // type closePort = (void) => Promise<void>;
    const closePort = async () => {
      const localPort = port
      port = undefined
      if (reader) {
        await reader.cancel()
      }

      if (localPort) {
        try {
          await localPort.close()
          markDisconnected()
        } catch (e) {
          _onError(e)
        }
      }
    }

    // type sendMessage(message: Uint8Array) => void;
    const sendMessage = async (message) => {
      if (port && port.writable) {
        try {
          const writer = port.writable.getWriter()
          await writer.write(message)
          writer.releaseLock()
        } catch (e) {
          _onError(e)
        }
      } else {
        _onError(new Error("Can't send message, serial pot may not open."))
      }
    }

    return {
      openPort,
      closePort,
      sendMessage,
      updateCallbacks
    }
  }
})()

export default webSerialWrap
