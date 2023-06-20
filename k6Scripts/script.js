/**
 * We want a k6 report that will show the performance differences
 * standard requests seem fine, browser almost works, but cant select inputs on the itslive page due to generating ids 
 * ran a test w/ 1000 users, itslive broke and mappin was totally fine
 * export to csv then plot?
 */
import { chromium } from 'k6/experimental/browser';
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    // mappinBrowser: {
    //   executor: 'constant-vus',
    //   exec: 'browser',
    //   vus: 15,
    //   duration: '60s',
    // },
    mappin: {
      executor: 'constant-vus',
      vus: 50,
      duration: '160s',
    }
  },
};


export default function mappin() {
  const res = http.get('https://itslive-dashboard.labs.nsidc.org/');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}


export async function browser() {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  try {
    await page.goto('https://itslive-dashboard.labs.nsidc.org/');
    await page.waitForSelector('div[class="widget-html-content"]');
    console.log('page loaded');

  } finally {
    page.close();
    browser.close();
  }
}

export async function oldbrowser() {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  try {
    await page.goto('https://mappin.itsliveiceflow.science/');
    await page.waitForSelector('button[class="mx-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"]');
    // console.log('page loaded');

  } finally {
    page.close();
    browser.close();
  }
}
