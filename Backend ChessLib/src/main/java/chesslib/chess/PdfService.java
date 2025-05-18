package chesslib.chess;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] gerarPdfPartida(String jogadorBrancas, String jogadorPretas, String lances) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Partida de Xadrez");
                contentStream.newLineAtOffset(0, -30);
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.showText("Jogador Brancas: " + jogadorBrancas);
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Jogador Pretas: " + jogadorPretas);
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Lances:");
                contentStream.newLineAtOffset(0, -15);

                String[] partes = lances.split(" ");
                StringBuilder linha = new StringBuilder();
                int y = 655;
                for (String lance : partes) {
                    if (linha.length() + lance.length() > 70) {
                        contentStream.newLineAtOffset(0, -15);
                        contentStream.showText(linha.toString());
                        linha = new StringBuilder();
                        y -= 15;
                    }
                    linha.append(lance).append(" ");
                }
                if (linha.length() > 0) {
                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText(linha.toString());
                }

                contentStream.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }
}
