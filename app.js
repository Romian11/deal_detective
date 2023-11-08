const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 8000;
const { URL } = require("url");
const querystring = require("querystring");

const partial_path = path.join(__dirname, "./views/partials");
app.use(express.static("./public"));
hbs.registerPartials(partial_path);
app.set("view engine", hbs);

app.set("views", "./views");

app.set("views", path.join(__dirname, "./views"));

const exphbs = require("express-handlebars");
const { url } = require("inspector");
// const { hasClass } = require("cheerio/lib/api/attributes");
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  const url = `https://www.flipkart.com/search`;
  axios
    .get(url)
    .then((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        const products = [];
        $("div[data-id]")
          .map((index, element) => {
            const title1 = $(element).find('div[class*="_4rR01T"]').text();
            const title2 = $(element).find(".IRpwTa").text();
            const title3 = $(element).find(".s1Q9rs").text();

            const isValidTitle1 = title1 && title1.trim() !== "";
            const isValidTitle2 = title2 && title2.trim() !== "";

            const productTitle = isValidTitle1
              ? title1
              : isValidTitle2
              ? title2
              : title3;
            const title = productTitle;
            
            const price = $(element).find('div[class*="_30jeq3"]').text();
            const image = $(element).find("img[src]").attr("src");
            const rating = $(element).find('div[class*="_3LWZlK"]').text();
            const halflink = $(element).find("a._1fQZEK").attr("href");
            const halflink2 = $(element).find("a.s1Q9rs").attr("href");
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

            products.push({ title, price, image, rating, link });
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

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
};

const product = [];
// console.log(product);
app.get("/search", (req, res) => {
  const input = req.query.query;
  const url = `https://www.flipkart.com/search?q=${input}`;
  axios
    .get(url)
    .then((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        const products = $("div[data-id]")
          .map((index, element) => {
            const title1 = $(element).find('div[class*="_4rR01T"]').text();
            const title2 = $(element).find(".IRpwTa").text();
            const title3 = $(element).find(".s1Q9rs").text();

            const isValidTitle1 = title1 && title1.trim() !== "";
            const isValidTitle2 = title2 && title2.trim() !== "";

            const productTitle = isValidTitle1
              ? title1
              : isValidTitle2
              ? title2
              : title3;
            const title = productTitle;

            const price = $(element).find('div[class*="_30jeq3"]').text();
            const image = $(element).find("img[src]").attr("src");
            const rating = $(element).find('div[class*="_3LWZlK"]').text();
            const halflink = $(element).find("a._1fQZEK").attr("href");
            const halflink2 = $(element).find("a.s1Q9rs").attr("href");
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
        axios.get(`https://www.amazon.in/s?k=${input}`, { headers: headers }),
        axios.get(link, {
          headers: headers,
        }),
      ]);

      const $1 = cheerio.load(amazonResponse.data);
      const $ = cheerio.load(flipkartResponse.data);
      var product = [];

      const title1 = $(".B_NuCI").text();
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

      const price = $('div[class*="_30jeq3"]').eq(0).text();
      const rating = $('div[class*="_3LWZlK"]').eq(0).text();

      var image1 = $("img._2r_T1I._396QI4").attr("src");

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
