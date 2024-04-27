const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3000;
const { URL } = require("url");
const querystring = require("querystring");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const partial_path = path.join(__dirname, "./views/partials");
app.use(express.static("./public"));
hbs.registerPartials(partial_path);
app.set("view engine", hbs);

app.set("views", "./views");

app.set("views", path.join(__dirname, "./views"));

const exphbs = require("express-handlebars");
const { url } = require("inspector");
app.set("view engine", "hbs");
const headers = {
  Host: "www.flipkart.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.3",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
};
const headers2 = {
  Host: "www.amazon.co.in",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.3",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
};

// import { browser } from "puppeteer";
const { executablePath } = require("puppeteer");
// Add the stealth plugin
puppeteer.use(StealthPlugin());

// app.get("/", async (req, res) => {
//   try {
  // C:\Users\sahil\.cache\puppeteer\chrome-headless-shell\win64-124.0.6367.78
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto("https://www.flipkart.com/search");

//     const products = await page.evaluate(() => {
//       const productsArray = [];
//       const productElements = document.querySelectorAll("div[data-id]");

//       productElements.forEach((element) => {
//         const titleElement =
//           element.querySelector("a.WKTcLC") ||
//           element.querySelector("div.WKTcLC");
//         const title = titleElement ? titleElement.textContent.trim() : "";

//         const priceElement = element.querySelector("div.Nx9bqj");
//         const price = priceElement ? priceElement.textContent.trim() : "";

//         const imageElement = element.querySelector("img[src]");
//         const image = imageElement ? imageElement.getAttribute("src") : "";

//         const ratingElement = element.querySelector('div[class*="XQDdHH"]');
//         const rating = ratingElement ? ratingElement.textContent.trim() : "";

//         const linkElement =
//           element.querySelector("a.VJA3rP") ||
//           element.querySelector("a.s1Q9rs") ||
//           element.querySelector("a._2UzuFa") ||
//           element.querySelector('div[class*="_4rR01T"]');
//         const link = linkElement
//           ? "https://www.flipkart.com" + linkElement.getAttribute("href")
//           : "";

//         productsArray.push({ title, price, image, rating, link });
//       });

//       return productsArray;
//     });

//     await browser.close();

//     res.render("index.hbs", { products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error.message);
//   }
// });
const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
app.get("/", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.flipkart.com/search");
  const products = await page.evaluate(() => {
    const productsArray = [];
    const productElements = document.querySelectorAll("div[data-id]");

    productElements.forEach((element) => {
      const titleElement =
        element.querySelector("a.WKTcLC") ||
        element.querySelector("div.WKTcLC");
      const title = titleElement ? titleElement.textContent.trim() : "";

      const priceElement = element.querySelector("div.Nx9bqj");
      const price = priceElement ? priceElement.textContent.trim() : "";

      const imageElement = element.querySelector("img[src]");
      const image = imageElement ? imageElement.getAttribute("src") : "";

      const ratingElement = element.querySelector('div[class*="XQDdHH"]');
      const rating = ratingElement ? ratingElement.textContent.trim() : "";

      const linkElement =
        element.querySelector("a.VJA3rP") ||
        element.querySelector("a.s1Q9rs") ||
        element.querySelector("a._2UzuFa") ||
        element.querySelector('div[class*="_4rR01T"]');
      const link = linkElement
        ? "https://www.flipkart.com" + linkElement.getAttribute("href")
        : "";

      productsArray.push({ title, price, image, rating, link });
    });

    return productsArray;
  });

  await browser.close();

  res.render("index.hbs", { products });
});

const product = [];
// console.log(product);
app.get("/search", (req, res) => {
  const input = req.query.query;
  const url = `https://www.flipkart.com/search?q=${input}`;
  axios
    .get(url, { headers: headers })
    .then((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        const products = $("div[data-id]")
          .map((index, element) => {
            const title1 = $(element).find('div[class*="_4rR01T"]').text();
            const title2 = $(element).find(".KzDlHZ").text();
            const title3 = $(element).find(".WKTcLC").text();

            const isValidTitle1 = title1 && title1.trim() !== "";
            const isValidTitle2 = title2 && title2.trim() !== "";

            const productTitle = isValidTitle1
              ? title1
              : isValidTitle2
              ? title2
              : title3;
            const title = productTitle;

            const price = $(element).find('div[class*="Nx9bqj"]').text();
            const image = $(element).find("img[src]").attr("src");
            var rating = $(element).find('div[class*="XQDdHH"]').text();
            if (rating == "") rating = "unavailable";
            const halflink = $(element).find("a.CGtC98").attr("href");
            const halflink2 = $(element).find("a.rPDeLR").attr("href");
            const halflink3 = $(element).find("a._2UzuFa").attr("href");
            const halflink4 = $(element)
              .find('div[class*="_4rR01T"]')
              .attr("href");
            const isValidLink = halflink && halflink.trim() !== "";
            const isValidLink2 = halflink2 && halflink2.trim() !== "";
            const isValidLink3 = halflink3 && halflink3.trim() !== "";
            const productLink = isValidLink
              ? halflink
              : isValidLink2
              ? halflink2
              : isValidLink3
              ? halflink3
              : halflink4;

            const link = "https://www.flipkart.com" + productLink;
            // const link = "https://www.flipkart.com" + halflink;

            return { title, price, image, rating, link };
          })
          .get();

        res.render("index.hbs", { products });
      } else {
        res.status(response.status).send("Request failed");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

app.get("/login", (req, res) => {
  res.render("login.hbs");
});

app.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword.hbs");
});

app.get("/compare", (req, res) => {
  const input = req.query.title;
  const link = req.query.link;

  fetchDataFromAmazonAndFlipkart(link, input);
  async function fetchDataFromAmazonAndFlipkart(link) {
    try {
      const [amazonResponse, flipkartResponse] = await axios.all([
        axios.get(`https://www.amazon.in/s?k=${input}`, { headers: headers2 }),
        axios.get(link, {
          headers: headers,
        }),
      ]);

      const $1 = cheerio.load(amazonResponse.data);
      const $ = cheerio.load(flipkartResponse.data);
      var product = [];

      const title1 = $("span.VU-ZEz").text();
      const title2 = $(".IRpwTa").text();
      const title3 = $(".s1Q9rs").text();

      const isValidTitle1 = title1 && title1.trim() !== "";
      const isValidTitle2 = title2 && title2.trim() !== "";

      const productTitle = isValidTitle1
        ? title1
        : isValidTitle2
        ? title2
        : title3;
      const title = productTitle;

      const price = $('div[class*="Nx9bqj CxhGGd"]').eq(0).text();
      var rating = $('div[class*="XQDdHH"]').eq(0).text();
      rating = rating + " out of 5 starts";
      var image1 = $("img.DByuf4.IZexXJ.jLEJ7H").attr("src");

      const cheerioobj = $("div.CXW8mj._3nMexc img._396cs4._2amPTt._3qGmMb");
      const isValidImage = cheerioobj.length != 0;

      const image = isValidImage
        ? $("div.CXW8mj._3nMexc img._396cs4._2amPTt._3qGmMb")
            .attr("srcset")
            .split(" ")[0]
        : image1;

      product.push({
        title: title,
        price: price,
        image: image,
        rating: rating,
        link: link,
      });

      const amazon_product = [];
      $1(".s-result-item").each((index, element) => {
        const amazon_title = $1(element).find("h2 span").text().trim();
        const amazon_price = $1(element)
          .find(".a-price-whole")
          .first()
          .text()
          .trim();

        const amazon_rating = $1(".a-icon-alt").eq(0).text();
        const url = $1(element).find("a.a-link-normal").attr("href");
        const amazon_link = "https://www.amazon.in/" + url;

        amazon_product.push({
          amazon_title: amazon_title,
          amazon_price: amazon_price,
          amazon_rating: amazon_rating,
          amazon_link: amazon_link,
        });
      });
      // console.log(amazon_product);
      var a_title = null,
        a_price = null,
        a_rating = null,
        a_link = null;

      for (let i = 0; i < amazon_product.length; i++) {
        const productx = amazon_product[i];
        const flipkart_title_first_word = product[0].title.split(" ")[0];
        const long_length = flipkart_title_first_word > 6;
        amazon_title_x = long_length
          ? productx.amazon_title.substring(0, 12).trim().toLowerCase()
          : productx.amazon_title.substring(0, 6).trim().toLowerCase();
        flipkart_title_x = long_length
          ? product[0].title.substring(0, 12).trim().toLowerCase()
          : product[0].title.substring(0, 6).trim().toLowerCase();

        if (amazon_title_x == flipkart_title_x) {
          a_title = productx.amazon_title;
          a_price = productx.amazon_price;
          a_link = productx.amazon_link;
          a_rating = productx.amazon_rating;
          break;
        }
      }

      if (!a_title) {
        a_title = product[0].title;
        a_rating = "unavailable";
        a_price = "Currently Unavailable";
        a_link = "";
      }
      if (!a_price) {
        a_price = "Out Of stock";
      }
      res.render("compare.hbs", {
        f_title: product[0].title,
        f_image: product[0].image,
        f_rating: product[0].rating,
        f_price: product[0].price,
        f_link: product[0].link,
        a_title: a_title,
        a_price: a_price,
        a_rating: a_rating,
        a_link: a_link,
      });
    } catch (error) {
      console.error("error" + error);
    }
  }
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
