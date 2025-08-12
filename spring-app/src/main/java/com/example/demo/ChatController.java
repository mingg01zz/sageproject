
package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ChatController {

    private final RasaClient rasaClient;

    public ChatController(RasaClient rasaClient) {
        this.rasaClient = rasaClient;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest req) {
        if (req == null || req.getMessage() == null || req.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<String> replies = rasaClient.sendMessage(req.getSender(), req.getMessage());
        return ResponseEntity.ok(new ChatResponse(replies));
    }
}
