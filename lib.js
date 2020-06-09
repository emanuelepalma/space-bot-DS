const https = require('https');

function rest_request(url) {
  let prom = new Promise((resolve, reject) => {
    https.get(url, (res) => {

      const {statusCode} = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
           `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
           `Expected application/json but received ${contentType}`);
      }
      if (error) {
        // Consume response data to free up memory
        res.resume();
        reject(error)
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData)
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', (e) => {
      reject(e)
    });
  })
  return (prom)
}

function get_random_date(startDate, endDate) {
    if(!startDate) startDate = new Date();
    if(!endDate) endDate = new Date();

    let diff = endDate.getTime() - startDate.getTime();
    return new Date(Math.random() * diff + startDate.getTime());
}

function format_date(date_ob) {
  // year as 4 digits (YYYY)
  let year = date_ob.getFullYear();
  // month as 2 digits (MM)
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // date as 2 digits (DD)
  let day = ("0" + date_ob.getDate()).slice(-2);
  // date as YYYY-DD-MM format
  outDate = `${year}-${month}-${day}`;
  return (outDate)
}

function get_apod_date(args) {
  let d = new Date();

  // >apod 2 days ago or >apod 2 months ago or >apod 6 years ago
  if (args.length >= 3 &&
     /[0-9]+/.test(args[0]) &&
     ["days", "months", "years"].indexOf(args[1]) !== -1 &&
     args[2] === "ago"
  ) {

    let num = parseInt(args[0])

    switch (args[1]) {
      case "days":
        d.setDate(d.getDate() - num);
        break;
      case "months":
        d.setMonth(d.getMonth() - num);
        break;
      case "years":
        d.setFullYear(d.getFullYear() - num);
        break;
    }

  // >apod mm-dd-yyyy or mm-dd-yy
  } else if (!isNaN(Date.parse(args[0]))) {
    // we search for the specific date
    d = new Date(Date.parse(args[0]));

  // >apod yesterday
  } else if (args[0] === "yesterday") {
    d.setDate(d.getDate() - 1);

  // >apod first
  } else if (args[0] === "first") {
    d = new Date("1995-06-16");

  } else if (args[0] == "random") {
    d = get_random_date(new Date("1995-06-16"))

  // >apod last month or >apod last year
  } else if (args[0] == "last" &&
     ["month", "year"].indexOf(args[1]) !== -1) {

    switch (args[1]) {
      case "month":
        d.setMonth(d.getMonth() - 1);
        break;
      case "year":
        d.setFullYear(d.getFullYear() - 1);
        break;
    }
  }
  return format_date(d)
}

// exports
module.exports.get_apod_date = get_apod_date;
module.exports.rest_request = rest_request;
module.exports.format_date = format_date;
module.exports.get_random_date = get_random_date;
