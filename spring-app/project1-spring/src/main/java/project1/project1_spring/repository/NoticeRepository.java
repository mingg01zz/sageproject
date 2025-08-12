package project1.project1_spring.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import project1.project1_spring.dto.BoardDto;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class NoticeRepository {

    private final JdbcTemplate jdbcTemplate;

    public NoticeRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public void save(BoardDto notice) {
        String sql = "INSERT INTO notice_board (title, content, writer, view_count, post_type, created_at) VALUES (?, ?, ?, 0, ?, ?)";

        jdbcTemplate.update(sql, notice.getTitle(), notice.getContent(), notice.getWriter(), notice.getPostType(), Timestamp.valueOf(notice.getCreatedAt()));
    }

    public List<BoardDto> findAll() {
        String sql = "SELECT * FROM notice_board";
        return jdbcTemplate.query(sql, noticeRowMapper());
    }

    public BoardDto findById(Long id) {
        String sql = "SELECT * FROM notice_board WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, noticeRowMapper(), id);
    }

    private RowMapper<BoardDto> noticeRowMapper() {
        return new RowMapper<BoardDto>() {
            @Override
            public BoardDto mapRow(ResultSet rs, int rowNum) throws SQLException {
                BoardDto notice = new BoardDto();
                notice.setId(rs.getLong("id"));
                notice.setTitle(rs.getString("title"));
                notice.setContent(rs.getString("content"));
                notice.setWriter(rs.getString("writer"));
                notice.setView_count(rs.getInt("view_count"));
                notice.setPostType(rs.getString("post_type"));
                notice.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                return notice;
            }
        };
    }
}