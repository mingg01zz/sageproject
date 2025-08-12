package project1.project1_spring.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import project1.project1_spring.domain.Facility;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class FacilityRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public FacilityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Facility> findAll() {
        String sql = "SELECT 기관번호, 기관명, 주소, 전화번호 FROM facility_info";
        return jdbcTemplate.query(sql, new FacilityRowMapper());
    }

    private static class FacilityRowMapper implements RowMapper<Facility> {
        @Override
        public Facility mapRow(ResultSet rs, int rowNum) throws SQLException {
            Facility facility = new Facility();
            facility.setId(rs.getLong("기관번호"));
            facility.setName(rs.getString("기관명"));
            facility.setAddress(rs.getString("주소"));
            facility.setPhone(rs.getString("전화번호"));
            return facility;
        }
    }
}