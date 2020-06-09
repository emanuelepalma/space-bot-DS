const config = require("../config.json");
const assert = require('assert');
const {
  format_date,
  get_apod_date,
  rest_request
} = require('../lib.js')

// TEST DATE
describe('Test date generation', () => {
  // TODO: test random date (how?)
  it('formatting', () => {
    let today = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: '2-digit', day: '2-digit'})
    const [{value: month}, , {value: day}, , {value: year}] = dateTimeFormat.formatToParts(today)
    apod_date = format_date(today)
    assert.equal(`${year}-${month}-${day}`, apod_date)
  });
  it('today', () => {
    let args = [""];
    let today = format_date(new Date());
    let outDate = get_apod_date(args);
    assert.equal(today, outDate);
  });
  it('yesterday', () => {
    let args = ["yesterday"];
    let today = new Date();
    today.setDate(today.getDate() - 1)
    let yesterday = format_date(today);
    let outDate = get_apod_date(args);
    assert.equal(yesterday, outDate)
  });
  it('2 days ago', () => {
    let args = ["2", "days", "ago"];
    let today = new Date();
    today.setDate(today.getDate() - 2);
    let two_days_ago = format_date(today)
    let outDate = get_apod_date(args);
    assert.equal(two_days_ago, outDate)
  });
  it('2 months ago', () => {
    let args = ["2", "months", "ago"];
    let today = new Date();
    today.setMonth(today.getMonth() - 2)
    let two_months_ago = format_date(today)
    let outDate = get_apod_date(args);
    assert.equal(two_months_ago, outDate)
  });
  it('2 years ago', () => {
    let args = ["2", "years", "ago"];
    let today = new Date();
    today.setFullYear(today.getFullYear() - 2)
    let two_years_ago = format_date(today)
    let outDate = get_apod_date(args);
    assert.equal(two_years_ago, outDate)
  });
  it('last month', () => {
    let args = ["last", "month"];
    let today = new Date();
    today.setMonth(today.getMonth() - 1)
    let last_month = format_date(today)
    let outDate = get_apod_date(args);
    assert.equal(last_month, outDate)
  });
  it('last year', () => {
    let args = ["last", "year"];
    let today = new Date();
    today.setFullYear(today.getFullYear() - 1)
    let last_year = format_date(today)
    let outDate = get_apod_date(args);
    assert.equal(last_year, outDate)
  });
  it('first apod date', () => {
    let args = ["first"];
    let today = new Date("1995-06-16");
    let first_apod = format_date(today);
    let outDate = get_apod_date(args);
    assert.equal(first_apod, outDate)
  });
  it('specific date', () => {
    let args = ["2020-06-04"];
    let today = new Date("2020-06-04");
    let custom_date = format_date(today);
    let outDate = get_apod_date(args);
    assert.equal(custom_date, outDate)
  });
});

// TEST REST CALL
describe('Test Rest function', () => {
  it('should have foo1', async () => {
    let url = 'https://postman-echo.com/get?foo1=bar1';
    parseData = await rest_request(url)
    assert.equal(parsedData.hasOwnProperty("foo1"), true)
  });
  it('value of foo1 should be bar1', async () => {
    let url = 'https://postman-echo.com/get?foo1=bar1';
    parseData = await rest_request(url)
    assert.equal(parsedData.foo1, "bar1")
  });
})