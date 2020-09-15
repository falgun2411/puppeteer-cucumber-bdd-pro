const { setWorldConstructor } = require('cucumber')
const { expect } = require('chai')
const puppeteer = require('puppeteer')
const scrollPageToBottom = require('puppeteer-autoscroll-down')

class CustomWorld {

  async launchBrowser() {
    const browser = await puppeteer.launch({
      headless: true, slowMo: 100, args: [
        '--start-maximized',
      ],
      defaultViewport: null,
    });
    const page = await browser.newPage();
    this.browser = browser;
    this.page = page;
    this.page.setDefaultNavigationTimeout(20000);
    this.page.setDefaultTimeout(120000);
    const OFFERNAME = ""
  }

  async closeBrowser() {
    // Teardown browser
    if (this.browser) {
      await this.browser.close();
    }
  }

  async gotoMainPage(pageURL) {
    const path_consentButton = 'button[aria-label=Einwilligen][id="uc-btn-accept-banner"]'
    await this.page.goto(pageURL, { waitUntil: 'networkidle0' });
    expect(this.page.url()).to.be.eq(pageURL)
    if (await this.page.$(path_consentButton) !== null) {
      await this.page.click(path_consentButton)
    }
  }

  async checkDlsCalculator() {
    const path_DLSCalculatorModule = '#mps-label-5'
    const path_moduleTitle = 'div.calculator:nth-child(6) form.calculator-form > div.calculator-headline'
    await this.page.waitForSelector(path_DLSCalculatorModule, { timeout: 1000 });
    await this.page.click(path_DLSCalculatorModule)
    const spanVal = await this.page.$eval(path_moduleTitle, el => el.innerText);
    expect(spanVal).to.be.eq('Internet+Telefon')
  }

  async enterAreaCodeAndBandwidthDetails(phonePrefix, bandwidth) {
    const path_phonePrefix = "input[type='tel'][name='phonePrefix']"
    await this.page.waitForSelector(path_phonePrefix, { visible: true }, { timeout: 5000 })
    await this.page.type(path_phonePrefix, phonePrefix)
    const path_bandwidth = 'div.calc-toggles.toggle-two-lines label:nth-child(5) > strong:nth-child(1)'
    await this.page.waitForSelector(path_bandwidth, { visible: true }, { timeout: 1000 })
    const bandwidth_value = await this.page.$eval(path_bandwidth, el => el.innerText);
    var count = parseInt(bandwidth_value.trim());
    expect(count).to.be.eq(16)
    await this.page.click(path_bandwidth)
  }

  async clickCompareNow(buttonLabel) {
    const path_button = '#mps-tab-box-5 > .calculator-form > .page-default-signup > .page-button'
    await this.page.waitForSelector(path_button, { visible: true }, { timeout: 1000 })
    var textvalue = await this.page.$eval(path_button, el => el.innerText);
    expect(textvalue.toUpperCase()).to.be.eq(buttonLabel)
    await this.page.click(path_button)
    await this.page.waitForNavigation({ waitUntil: 'load', timeout: 20000 })
  }

  async checkAllAvailableTariffOnResultListPage() {
    const path_header1 = 'h1:nth-child(1)'
    const path_header2 = 'h1:nth-child(2)'
    const path_offers = '.align-items-stretch'
    await this.page.waitForSelector('h1', { visible: true }, { timeout: 1000 })
    const recomended_teriff = await this.page.$eval(path_header1, el => el.innerText);
    expect(recomended_teriff).to.be.eq('Verivox-Tarifempfehlung')
    const calculated_tariff = await this.page.$eval(path_header2, el => el.innerText);
    expect(calculated_tariff).to.be.eq('Ermittelte Tarife')
    await this.page.waitForSelector(path_offers, { visible: true }, { timeout: 2000 })
    let total_Tarifffs = (await this.page.$$(path_offers)).length
    expect(total_Tarifffs).to.be.greaterThan(5)
    expect(this.page.url()).to.have.string("https://www.verivox.de/internet/vergleich/")
  }

  async loadAllDLSTariffDetailsResultListPage(pageURL) {
    await this.gotoMainPage(pageURL)
    await this.checkDlsCalculator()
    await this.enterAreaCodeAndBandwidthDetails("030", "16")
    await this.clickCompareNow("JETZT VERGLEICHEN")
    await this.checkAllAvailableTariffOnResultListPage()
  }

  async SelectOfferOnListPageAndSaveOfferName() {
    var i;
    for (i = 0; i < 20; i++) {
      await this.page.keyboard.press('ArrowDown');
    }
    const offernameField_path = '.row:nth-child(4) .headline-short-name'
    const secondaryButton_path = '.row:nth-child(4) .button-secondary:nth-child(2)'
    const path_tab1 = '.tab:nth-child(1)'
    const path_tab2 = '.tab:nth-child(2)'
    const path_tab3 = '.tab:nth-child(3)'
    const path_tab4 = '.tab:nth-child(4)'
    const path_tab5 = '.tab:nth-child(5)'

    await this.page.waitForSelector(offernameField_path, { timeout: 3000 });
    const offername_Value = await this.page.$eval(offernameField_path, el => el.innerText);

    this.OFFERNAME = offername_Value
    await this.page.waitForSelector(secondaryButton_path, { timeout: 3000 });
    const secondaryButton_value = await this.page.$eval(secondaryButton_path, el => el.innerText);
    expect(secondaryButton_value.trim()).to.be.eq("TARIFDETAILS")
    await this.page.click(secondaryButton_path)

    await this.page.waitForSelector(path_tab1, { visible: true }, { timeout: 1000 });
    const tabValue1 = await this.page.$eval(path_tab1, el => el.innerText);
    expect(tabValue1).to.be.eq("Preisdetails")
    await this.page.waitForSelector(path_tab2, { visible: true }, { timeout: 1000 });
    const tabValue2 = await this.page.$eval(path_tab2, el => el.innerText);
    expect(tabValue2).to.be.eq("Hardware")
    await this.page.waitForSelector(path_tab3, { visible: true }, { timeout: 1000 });
    const tabValue3 = await this.page.$eval(path_tab3, el => el.innerText);
    expect(tabValue3).to.be.eq("Optionen")
    await this.page.waitForSelector(path_tab4, { visible: true }, { timeout: 1000 });
    const tabValue4 = await this.page.$eval(path_tab4, el => el.innerText);
    expect(tabValue4).to.be.eq("Minutenpreise")
    await this.page.waitForSelector(path_tab5, { visible: true }, { timeout: 1000 });
    const tabValue5 = await this.page.$eval(path_tab5, el => el.innerText);
    expect(tabValue5).to.be.eq("Tarifeigenschaften")
  }

  async clickToOfferButton(buttonName) {
    const path_primaryButton = '.row:nth-child(4) .button-primary:nth-child(1)'
    await this.page.waitForSelector(path_primaryButton, { timeout: 3000 });
    const primaryButton = await this.page.$eval(path_primaryButton, el => el.innerText);
    expect(buttonName.toUpperCase()).to.be.eq(primaryButton)
    await this.page.click(path_primaryButton)
    await this.page.waitForNavigation({ waitUntil: 'load', timeout: 20000 })
  }

  async verifyOfferDetailsOfSelectedOffer() {
    const path_offerDetails = 'div.offer-page-cta-wrapper'
    const path_header = 'h1'
    console.log("Main OFFER Name: " + this.OFFERNAME)
    await this.page.waitForSelector(path_header, { visible: true }, { timeout: 1000 })
    const headerText = await this.page.$eval(path_header, el => el.innerText);
    console.log('Offer name on details page: ' + headerText);
    expect(headerText).to.have.string(this.OFFERNAME)
    await this.page.waitForSelector(path_offerDetails, { visible: true }, { timeout: 1000 });
  }

  async verifySwitchToOnlineIn5MinuteButton(buttonName) {
    await this.page.waitFor(500)
    const path_In5MinButton = '.responsive-label-txt.offer-page-cta'
    await this.page.waitForSelector(path_In5MinButton, { visible: true }, { timeout: 1000 });
    const buttonText = await this.page.$eval(path_In5MinButton, (elem) => {
      return window.getComputedStyle(elem, ':before').getPropertyValue('content')
    });
    console.log('buttonText:' + buttonText);
    const updatedButtonName = buttonText.replace(/"/g, " ")
    expect(updatedButtonName.trim()).to.be.eq(buttonName)
  }

  async checkMoreThan20TariffProvided() {
    const path_totalTariffProvided = 'h2.summary-tariff'
    await this.page.waitForSelector(path_totalTariffProvided, { visible: true }, { timeout: 1000 })
    const totalTarrifs = await this.page.$eval(path_totalTariffProvided, el => el.innerText);
    var totalTarrifsCount = parseInt(totalTarrifs.substring(0, 3).trim())
    console.log("--- TOTAL Tarrif offers count to be loaded:" + totalTarrifsCount)
    expect(totalTarrifsCount).to.be.greaterThan(20)
  }

  async verifyLoad20MoreTariffButton(buttonName) {
    const button = " " + buttonName + " "
    const path_loadMoreTariffOfferButton = 'button.btn.btn-primary.text-uppercase[type=button]'
    await this.page.waitForSelector(path_loadMoreTariffOfferButton, { visible: true }, { timeout: 1000 })
    const buttonText = await this.page.$eval(path_loadMoreTariffOfferButton, el => el.innerText);
    expect(buttonText).to.be.eq(buttonName.toUpperCase())
  }

  async clickLoad20MoreTariffButton() {
    const path_loadMoreTariffOfferButton = 'button.btn.btn-primary.text-uppercase[type=button]'
    await this.page.waitForSelector(path_loadMoreTariffOfferButton, { visible: true }, { timeout: 1000 })
    await this.page.click(path_loadMoreTariffOfferButton)
  }

  async checkAllTariffPlansLoadedTillEnd() {
    const path_offers = 'div.row.align-items-center.align-items-stretch'
    await this.page.waitForSelector(path_offers, { visible: true }, { timeout: 10000 })
    let total_Tarifffs = (await this.page.$$(path_offers)).length
    await this.verifyingLazyLoafinofAllTheTariffsTilltheEnd()
  }

  async verifyingLazyLoafinofAllTheTariffsTilltheEnd() {
    const header1_path = 'h1:nth-child(1)'
    const header2_path = 'h1:nth-child(2)'
    const loadMoreTariffOfferButton_path = 'button.btn.btn-primary.text-uppercase[type=button]'

    var flag = true;
    while (flag) {
      await this.page.waitFor(3000);
      const path_offers = 'div.row.align-items-center.align-items-stretch'
      await this.page.waitForSelector(path_offers, { visible: true }, { timeout: 10000 })
      let total_Tarifffs = (await this.page.$$(path_offers)).length
      console.log("Currently Tariffs OFFERS loaded:" + total_Tarifffs)

      const recomended_teriff = await this.page.$eval(header1_path, el => el.innerText);
      expect(recomended_teriff).to.be.eq('Verivox-Tarifempfehlung')
      const calculated_tariff = await this.page.$eval(header2_path, el => el.innerText);
      expect(calculated_tariff).to.be.eq('Ermittelte Tarife')
      const lastPosition = await scrollPageToBottom(this.page)

      await this.page.waitFor(500)
      if (await this.page.$(loadMoreTariffOfferButton_path) !== null) {
        await this.page.waitForSelector(loadMoreTariffOfferButton_path, { visible: true }, { timeout: 5000 })
        const new_Tarifffs = await this.page.$eval(loadMoreTariffOfferButton_path, el => el.innerText);
        var count = parseInt(new_Tarifffs.substring(0, 3).trim());
        console.log("New more Tariffs OFFERS to be loaded:" + count)

        if (count != 20) {
          flag = false;
          console.log("Final Tariff offer page will be loading")
        }
        if (count > 1) {
          await this.page.waitForSelector(loadMoreTariffOfferButton_path, { visible: true }, { timeout: 5000 })
          await this.page.click(loadMoreTariffOfferButton_path, { timeout: 5000 })
          await this.page.waitFor(2000);
        }
      }
      else {
        break;
      }
    }
  }
}

setWorldConstructor(CustomWorld)