const { PDFDocument } = require("pdf-lib");

/**
 * Merge multiple PDFs into one
 * @param {Array<Buffer>} fileBuffers - Array of file buffers
 * @returns {Promise<Uint8Array>} - Merged PDF bytes
 */
const mergePdfs = async (fileBuffers) => {
    const mergedPdf = await PDFDocument.create();

    for (const buffer of fileBuffers) {
        const pdf = await PDFDocument.load(buffer);
        const copiedPages = await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
};

module.exports = {
    mergePdfs,
};
