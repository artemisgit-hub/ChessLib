package chesslib.chess;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jogadorBrancas;
    private String jogadorPretas;
    private LocalDateTime data;

    @Lob
    private String lances;

    public Long getId() { 
    	return id; 
    	}
    
    public void setId(Long id) { 
    	this.id = id; 
    	}

    public String getJogadorBrancas() { 
    	return jogadorBrancas; 
    	}
    
    public void setJogadorBrancas(String jogadorBrancas) { 
    	this.jogadorBrancas = jogadorBrancas; 
    	}

    public String getJogadorPretas() { 
    	return jogadorPretas; 
    	}
    
    public void setJogadorPretas(String jogadorPretas) { 
    	this.jogadorPretas = jogadorPretas; 
    	}

    public LocalDateTime getData() { 
    	return data; 
    	}
    
    public void setData(LocalDateTime data) { 
    	this.data = data; 
    	}

    public String getLances() { 
    	return lances; 
    	}
    
    public void setLances(String lances) { 
    	this.lances = lances; 
    	}
}
