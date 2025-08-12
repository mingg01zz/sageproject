package project1.project1_spring.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import project1.project1_spring.dto.FaqDto;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class FaqRepository {

    private final JdbcTemplate jdbcTemplate;

    public FaqRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public List<FaqDto> findAll() {
        String sql = "SELECT id, title, question, writer, view_count, post_type, created_at, answer FROM faq_table";
        return jdbcTemplate.query(sql, faqRowMapper());
    }

    public FaqDto findById(Long id) {
        String sql = "SELECT id, title, question, writer, view_count, post_type, created_at, answer FROM faq_table WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, faqRowMapper(), id);
    }

    private RowMapper<FaqDto> faqRowMapper() {
        return (rs, rowNum) -> {
            FaqDto faq = new FaqDto();
            faq.setId(rs.getLong("id"));
            faq.setTitle(rs.getString("title"));
            faq.setQuestion(rs.getString("question"));
            faq.setWriter(rs.getString("writer"));
            faq.setView_count(rs.getInt("view_count"));
            faq.setPostType(rs.getString("post_type"));
            faq.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            faq.setAnswer(rs.getString("answer"));
            return faq;
        };
    }

    public void save(FaqDto faqDto) {
        String sql = "INSERT INTO faq_table (title, question, answer, writer, post_type) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                faqDto.getTitle(),
                faqDto.getQuestion(),
                "program",
                "관리자",
                "FAQ");
    }
}