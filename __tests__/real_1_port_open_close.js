import 'expect-puppeteer'

describe('real 1 port Open / Close', () => {
  const waitSpecifiedLog = (page, waitMsg) => {
    return new Promise((resolve) => {
      const waitLog = (msg) => {
        console.log('Wait for ' + waitMsg + ' : ' + msg.text())
        if (waitMsg === msg.text()) {
          console.log('LOG Message matched')
          page.off('console', waitLog)
          resolve(waitMsg)
        }
      }
      page.on('console', waitLog)
    })
  }

  beforeAll(async () => {
    await page.on('console', (msg) => console.log('Browser:', msg.text()))
    const waitLoad = new Promise((resolve) => {
      page.once('load', () => {
        console.log('Page loaded!')
        resolve()
      })
    })
    await page.goto('http://127.0.0.1:8080/')
    await waitLoad
    //    await new Promise((resolve)=>setTimeout(resolve, 1000))
  })

  it('open-cancel', async () => {
    const expStr = 'Open cancelled.'
    await expect(page).toClick('button', { text: 'OPEN' })
    const logStr = await waitSpecifiedLog(page, expStr)
    expect(logStr).toBe(expStr)
  })

  it('open-success', async () => {
    const expStr = 'onOpen()'
    await expect(page).toClick('button', { text: 'OPEN' })
    const logStr = await waitSpecifiedLog(page, expStr)
    expect(logStr).toBe(expStr)
  })

  it('close', async () => {
    await expect(page).toClick('button', { text: 'CLOSE' })
    const logStr = await waitSpecifiedLog(page, 'onClose()')
    expect(logStr).toBe('onClose()')
  })
})
