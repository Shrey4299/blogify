const admin = require("../../../../config/firebaseConfig");
const puppeteer = require("puppeteer");
const { PdfDocument } = require("@ironsoftware/ironpdf");
// import("./config");

exports.sendSampleMessage = async (req, res) => {
  try {
    console.log("entered in Puppeteer");

    // Convert the Web Page to a pixel-perfect PDF file.
    const pdf = await PdfDocument.fromUrl("https://www.google.com/");

    // Save the document.
    await pdf.saveAs("url-to-pdf.pdf");

    res.status(201).send("PDF is created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// exports.sendSampleMessage = async (req, res) => {
//   try {
//     console.log("entered in Puppeteer");

//     const url = "https://admin.hangs.in/pdf-maker/434_434/918018801808";
//     const outputfile = "example.pdf";

//     // Launch the browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto(url, { waitUntil: "networkidle2" });

//     await page.setViewport({ width: 1080, height: 1024 });

//     // Generate a PDF with background
//     await page.pdf({ path: outputfile, format: "A4", printBackground: true });

//     await browser.close();

//     res.status(201).send("PDF is created successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };
