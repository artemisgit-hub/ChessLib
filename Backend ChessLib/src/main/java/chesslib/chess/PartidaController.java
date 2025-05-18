package chesslib.chess;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api/partidas")
public class PartidaController {

    private final PartidaRepository repository;
    private final PdfService pdfService;

    public PartidaController(PartidaRepository repository, PdfService pdfService) {
        this.repository = repository;
        this.pdfService = pdfService;
    }

    @GetMapping
    public List<Partida> listarTodas() {
        return repository.findAll();
    }

    @PostMapping
    public Partida salvar(@RequestBody Partida partida) {
        return repository.save(partida);
    }

    @GetMapping("/exportar-pdf")
    public ResponseEntity<byte[]> exportarPdf(@RequestParam Long id) {
        try {
            Partida partida = repository.findById(id).orElse(null);
            if (partida == null) {
                return ResponseEntity.notFound().build();
            }

            String jogadorBrancas = partida.getJogadorBrancas();
            String jogadorPretas = partida.getJogadorPretas();
            String lances = partida.getLances();

            byte[] pdfBytes = pdfService.gerarPdfPartida(jogadorBrancas, jogadorPretas, lances);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=partida_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
