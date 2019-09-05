/**
 * @author Han Lin Yap
 * Feel free to donate btc: 1NibBDZPvJCm568CZMnJUBJoPyUhW7aSag
 */
declare var require: any;
require("fetch-register");
const fs = require("fs");

const formattedDayDate = date =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

async function getFullTradeDay(date: Date) {
  const halfDay = await getTradeDay(date);
  const halfDay2 = await getTradeDay(date, 720);
  const fullDay = halfDay.concat(halfDay2);
  return fullDay;
}

function getTradeDay(date: Date, offset: number = 0): Promise<[]> {
  const baseRequestUrl =
    "https://www.bitmex.com/api/v1/trade/bucketed?binSize=1m&partial=false&symbol=XBTUSD&reverse=false&";
  const requestUrl =
    baseRequestUrl +
    `count=720&start=${offset}&startTime=${formattedDayDate(date)}`;
  console.log('Request', requestUrl);
  return fetch(requestUrl).then(async res => {
    console.log('Ratelimit remaining', res.headers.get("x-ratelimit-remaining"));
    if (parseInt(res.headers.get("x-ratelimit-remaining")) < 20) {
      await new Promise(done => setTimeout(done, 60000));
    }

    return res.json().catch(e => {
      console.log(res);
      throw e;
    });
  });
}

export async function download(userConfig: { path: string, startDate: Date, endDate: Date }) {
  const defaultConfig = {
    path: 'data',
    startDate: new Date('2017'),
    endDate: new Date('2018'),
  }
  const config = Object.assign(defaultConfig, userConfig);
  const startTime = config.startDate.getTime();
  const endTime = config.endDate.getTime();

  for (let days = 0; startTime + days * 86400000 < endTime; days++) {
    const date = new Date(startTime + days * 86400000);
    const trade = await getFullTradeDay(date);
    fs.writeFileSync(
      `${config.path}/${formattedDayDate(date)}.json`,
      JSON.stringify(trade)
    );
    await new Promise(done => setTimeout(done, 4000));
  }
}

export default {
  download,
}