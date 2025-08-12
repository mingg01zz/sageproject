
package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class RasaClient {

    @Value("${rasa.url:http://localhost:5005}")
    private String rasaUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<String> sendMessage(String sender, String message) {
        String url = rasaUrl + "/webhooks/rest/webhook";

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", sender == null ? "web" : sender);
        payload.put("message", message);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<List> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, List.class);

        List<String> texts = new ArrayList<>();
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            for (Object o : response.getBody()) {
                if (o instanceof Map) {
                    Object t = ((Map)o).get("text");
                    if (t != null) texts.add(String.valueOf(t));
                }
            }
        }
        return texts;
    }
}
