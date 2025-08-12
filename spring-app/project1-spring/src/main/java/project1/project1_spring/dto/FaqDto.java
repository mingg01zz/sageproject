package project1.project1_spring.dto;

import java.time.LocalDateTime;

public class FaqDto {

    private Long id;
    private String title;
    private String question;
    private String writer;
    private int view_count;
    private String postType;
    private LocalDateTime createdAt;
    private String answer; // 🟢 추가된 필드

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public int getView_count() {
        return view_count;
    }

    public void setView_count(int view_count) {
        this.view_count = view_count;
    }

    public String getPostType() {
        return postType;
    }

    public void setPostType(String postType) {
        this.postType = postType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAnswer() { // 🟢 answer 필드의 Getter
        return answer;
    }

    public void setAnswer(String answer) { // 🟢 answer 필드의 Setter
        this.answer = answer;
    }
}