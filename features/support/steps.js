const { Given, When, Then, Before, After,setDefaultTimeout } = require('cucumber')
setDefaultTimeout(200 * 1000);

Before(async function () {
  return await this.launchBrowser()
})

After(async function () {
  return await this.closeBrowser()
})

Given('the User is on {string}', async function (pageURL) {
  return await this.gotoMainPage(pageURL)
})

When('he is on the DSL calculator', async function () {
  return this.checkDlsCalculator()
})

When('he enters prefix-code Ihre Vorwahl as {string} with {string} Mbits bandwidth selection', async function (phonePrefix, bandwidth) {
  return await this.enterAreaCodeAndBandwidthDetails(phonePrefix, bandwidth)
})

When('clicks on the button labeled as {string}', async function (buttonLabel) {
  return await this.clickCompareNow(buttonLabel)
})

Then(`he should be able see the Result List page with all the available Tariffs`, async function () {
  return await this.checkAllAvailableTariffOnResultListPage()
})

Given('User is on the DSL Result List', async function () {
  const pageURL = "https://www.verivox.de/"
  return await this.loadAllDLSTariffDetailsResultListPage(pageURL)
})

When('he selects one of the listed Tariffs', async function () {
  return await this.SelectOfferOnListPageAndSaveOfferName()
})

When('clicks on {string} button', async function (buttonName) {
  return await this.clickToOfferButton(buttonName)
})

Then('he should be able see the details of the selected Tariff', async function () {
  return await this.verifyOfferDetailsOfSelectedOffer()
})

When(`he should also see a button labeled as In 5 Minuten online wechseln`, async function () {
  return await this.verifySwitchToOnlineIn5MinuteButton()
})

When('there are more than 20 tariffs available for the provided Vorwahl and bandwidth', async function () {
  return await this.checkMoreThan20TariffProvided()
})

Then('the User should a button labeled as {string}', async function (buttonName) {
  return await this.verifyLoad20MoreTariffButton(buttonName)
})

When('he-she clicks on this button', async function () {
  return await this.clickLoad20MoreTariffButton()
})

Then(`the list should be appended with next 20 tariffs and so on until all Tariffs are loaded`, async function () {
  return await this.checkAllTariffPlansLoadedTillEnd()  
})