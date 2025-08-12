
package com.example.demo;

import java.util.List;

public class ChatResponse {
    private List<String> replies;

    public ChatResponse(List<String> replies) {
        this.replies = replies;
    }

    public List<String> getReplies() {
        return replies;
    }

    public void setReplies(List<String> replies) {
        this.replies = replies;
    }
}
