import { ApolloError } from 'apollo-server-express'
import puppeteer from 'puppeteer'

export default {
  Query: {
    requestBalance: async (root, { username, password }, context, info) => {
      // Create instances of puppeter browser and page
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
      const page = await browser.newPage()

      try {
        // Navigate to the login page
        await page.goto('https://www.banpro.com.ni/banproenlinea/loginNIC.asp?SourcePage=')
        // Remove the readonly attribute from the password field
        await page.evaluate(() => {
          let keyboard = document.querySelector('.keyboardInput')
          keyboard.removeAttribute('readonly')
        })
        // Proceed to type the credentials received in the request
        await page.type('input[name="fldLoginNameT"]', username)
        await page.type('input[name="fldPasswordT"]', password)
        // Submit the form and login
        await Promise.all([
          page.click('input[name="Submit"]'),
          page.waitForNavigation()
        ])
        // If no error then proceed to retreive and sanitize the required data
        let data = await page.evaluate(() => {
          let amount = document.querySelector('.saldo > a').innerText
          let accountNumber = document.querySelector('.uno > div > a').innerText
          let owner = document.querySelector('.titular').innerText
          let description = document.querySelector('.uno > div[class="left"]').innerText

          return { amount, accountNumber, owner, description }
        })
        // Logout
        await Promise.all([
          page.click('#zContent > table:nth-child(7) > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td > a:nth-child(3)'),
          page.waitForNavigation()
        ])
        // Close the page and browser
        await page.close()
        await browser.close()
        // return the sanitized data
        return data
      } catch (e) {
        console.log(e)
        // Retreive displayed error
        let error = await page.evaluate(() => {
          let e = document.querySelector('#zContent > table:nth-child(2) > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > b > div > font > center').innerText
          return e
        })
        console.log(error)
        // If error close the page and browser
        await page.close()
        await browser.close()
        // Log the visible error
        return new ApolloError(error)
      }
    }
  }
}
