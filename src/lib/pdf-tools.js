import PdfPrinter from "pdfmake";
import striptags from "striptags";
import axios from "axios";
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

export const getPDFReadableStream = async (blogPost) => {
  let imagePart = {};
  if (blogPost.cover) {
    const response = await axios.get(blogPost.cover, {
      responseType: "arraybuffer",
    });
    const blogPostCoverURLParts = blogPost.cover.split("/");
    const fileName = blogPostCoverURLParts[blogPostCoverURLParts.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }
  const docDefinition = {
    content: [
      imagePart,
      { text: blogPost.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
      { text: striptags(blogPost.content), lineHeight: 2 },
    ],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();
  return pdfReadableStream;
};
