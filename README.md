# webserial-wrap

> webserial-wrapper for browser application

[![NPM](https://img.shields.io/npm/v/use-react-webserial.svg)](https://www.npmjs.com/package/use-react-webserial) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save webserial-wrap
```

## Usage

A function `webSerialWrap` is exported.
`webSerialWrap` returns a object including 4 functions.
- openPort(requestPortFilters, options)
  - A function to open serial port.
  - `requestPortFilters` is used for [Serial.requestPort()](https://developer.mozilla.org/en-US/docs/Web/API/Serial/requestPort)
    - If not specified, [] is used, this shows all serial port in port select dialog.
  - `options` is used for [SerialPort.open()](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort/open)
    - If not specified, specified as follows.
      - baudrate: 115200
      - databits: 8
      - stopbits: 1
      - parity: 'none'
      - bufferSize: 255
      - flowControl: 'none'
  - Returns Promise resolves **when port has closed.**
    - **Don't await this promise**
    - Use onOpen callback to waiting for openning port.
  - If error occured, onError callback is called.
- closePort()
  - A function to close serial pot.
  - Returns Promise resolves when port has closed.
  - If port has not opened, error occurs.
- sendMessage(message)
  - A function to send data to serial port.
  - Returns Promise resolves when `message` has send to Tx buffer.
  - `message` expects Uint8Array.
    - If you want to send text, encode that text and set it to this function.
  - If port has not opened, error occurs.
- updateCallbacks({onOpen, onClose, onMessage, onError})
  - Update (replace) callback function if specified.
  - This function must be called while serial port is closed. 
  - onOpen()
    - Called if serial port has opened.
    - Return value is ignored.
  - onClose()
    - called if serial port has closed.
    - Return value is ignored.
  - onMessage(`message`)
    - called if serial port receives data.
      - `message` is Uint8Array.
        - If you want to handle as text, decode the `message`.
      - `message` may splitted, even if tx side send one long line.
      - So if you want to handle per line, concatinate with previous messages and split it by line terminater.
    - Return value is ignored.
  - onError(error)
    - called if serial port error has occured.
    - `error` is Error object.
    - Return value is ignored.

### limitation
The function openPort() must be called with user activation.
This limitation comes from specification of [Web Serial API](https://wicg.github.io/serial/#security)

## loadmap
Markdown
- [ ] Support handling string for Tx/Rx
  - A parser is not included, line parser including decode Uint8Array will be included, can specify line separator.
  - Tx message wrapper is not included, tx message wrapper encoding string to Uint8Array will be included, can specify adding line separator.
- [ ] Support port history, open using history.
  - Only Serial.requestPort() is used.
  - Serial.getPorts() can get ports they have already aproved by user.
- [ ] Support handling reading signal/writeing signal
  - Reading CTS,DSR,,DCD, RI using SerialPort.getSignals() is not supported.
  - Writing RTS,DTR,BREAK using SerialPort.setSignals() is not supported.
    - Description of SerialPort.setSignals() in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort/setSignals) may confusing with SerialPort.getSignals() in option fields. 
- [ ] Add test
  - Only function test by manual.
  - Category
    - 1 real port test
      - open()
        - Succeed by user action
        - requestPortFilter
          - empty, 1 element, 2 or more elements
        - resolve at closed
        - Error:Cancel at port select dialog.
        - Error:Specified port has already opended
      - close()
        - Succeed by user action
        - Error:if not opened.
      - sendMessage()
        - Error:if not opened.
      - updateCallbacks()
        - specified callback is updated.
        - onOpen()
          - Is called if open successfully.
        - onClose()
        　- Is called if close by user action.
        　- Is called if close by USB disconnected.
        - onError()
          - Checked by each function.

    - 2 real port and connect each other test
      - open()
        - option
          - baudrate,databits,stopbits,parity,flowControl
      - close()
      - sendMessage()
        - Send long message
        - Send short messages in short interval.
      - updateCallbacks()
        - onMessage()
          - Receive long message
          - Receive short messages in short interval.

## livedemo
You can see livedemo from [here](https://katonobu.github.io/webserial-wrap/).

## Credits
- Thanks to everyone who made Web Serial API for enabling this project to be possible.
  - [Serial Terminal](https://github.com/GoogleChromeLabs/serial-terminal)
- Much of the documentation about the usage and features of Web Serial API where taken from their documentation.
  - [Web Serial API](https://wicg.github.io/serial/)
  - [Web Serial API/MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)

## License

MIT © [katonobu](https://github.com/katonobu)
