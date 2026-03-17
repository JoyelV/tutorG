import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { logger } from '../utils/logger';

export class CertificateService {
    /**
     * Generates a PDF certificate for course completion.
     * @param res Express Response to pipe the PDF to
     * @param data Details for the certificate
     */
    public async generateCertificate(
        res: Response,
        data: {
            studentName: string;
            courseName: string;
            completionDate: string;
            instructorName?: string;
        }
    ): Promise<void> {
        const { studentName, courseName, completionDate, instructorName = 'TutorG Instructor' } = data;

        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0,
        });

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Certificate_${studentName.replace(/\s+/g, '_')}.pdf`
        );

        doc.pipe(res);

        try {
            // 1. Background Design
            this.drawBackground(doc);

            // 2. Border
            this.drawBorder(doc);

            // 3. Header
            doc.moveDown(4);
            doc
                .font('Helvetica-Bold')
                .fontSize(40)
                .fillColor('#1a1a1a')
                .text('CERTIFICATE OF COMPLETION', { align: 'center' });

            doc.moveDown(1);
            doc
                .font('Helvetica')
                .fontSize(18)
                .fillColor('#666666')
                .text('This is to certify that', { align: 'center' });

            // 4. Student Name
            doc.moveDown(1.5);
            doc
                .font('Helvetica-Bold')
                .fontSize(50)
                .fillColor('#2c3e50')
                .text(studentName.toUpperCase(), { align: 'center' });

            // 5. Course Details
            doc.moveDown(1);
            doc
                .font('Helvetica')
                .fontSize(18)
                .fillColor('#666666')
                .text('has successfully completed the course', { align: 'center' });

            doc.moveDown(1);
            doc
                .font('Helvetica-Bold')
                .fontSize(28)
                .fillColor('#1a1a1a')
                .text(`"${courseName}"`, { align: 'center' });

            // 6. Date and Signature
            doc.moveDown(3);

            const bottomY = doc.y;

            // Date Section
            doc
                .font('Helvetica')
                .fontSize(14)
                .fillColor('#666666')
                .text('Date of Completion:', 100, bottomY);

            doc
                .font('Helvetica-Bold')
                .fontSize(14)
                .fillColor('#1a1a1a')
                .text(completionDate, 100, bottomY + 20);

            // Signature Section
            doc
                .font('Helvetica')
                .fontSize(14)
                .fillColor('#666666')
                .text('Instructor:', 550, bottomY);

            doc
                .font('Helvetica-Bold')
                .fontSize(14)
                .fillColor('#1a1a1a')
                .text(instructorName, 550, bottomY + 20);

            // 7. Footer / Branding
            doc
                .fontSize(10)
                .fillColor('#95a5a6')
                .text('Verified by TutorG Learning Platform', 0, doc.page.height - 50, { align: 'center' });

            doc.end();
            logger.info(`Certificate generated for: ${studentName}`);
        } catch (error) {
            logger.error('Error generating PDF:', error);
            doc.end();
            throw error;
        }
    }

    private drawBackground(doc: PDFKit.PDFDocument): void {
        const width = doc.page.width;
        const height = doc.page.height;

        // Subtle background color
        doc.rect(0, 0, width, height).fill('#fdfdfd');

        // Decorative corner shapes (subtle)
        doc.save();
        doc.fillColor('#3498db').fillOpacity(0.1);
        doc.circle(0, 0, 150).fill();
        doc.circle(width, height, 150).fill();
        doc.restore();
    }

    private drawBorder(doc: PDFKit.PDFDocument): void {
        const margin = 30;
        const width = doc.page.width - margin * 2;
        const height = doc.page.height - margin * 2;

        // Outer thick border
        doc
            .rect(margin, margin, width, height)
            .lineWidth(3)
            .strokeColor('#2c3e50')
            .stroke();

        // Inner thin border
        doc
            .rect(margin + 10, margin + 10, width - 20, height - 20)
            .lineWidth(1)
            .strokeColor('#bdc3c7')
            .stroke();
    }
}

export const certificateService = new CertificateService();
