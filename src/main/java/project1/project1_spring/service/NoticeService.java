package project1.project1_spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project1.project1_spring.dto.BoardDto; // BoardDto를 사용합니다.
import project1.project1_spring.repository.NoticeRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<BoardDto> findAll() {
        return noticeRepository.findAll();
    }

    public BoardDto findById(Long id) {
        return noticeRepository.findById(id);
    }

    public void saveNotice(String title, String content) {
        BoardDto newNotice = new BoardDto();
        newNotice.setTitle(title);
        newNotice.setContent(content);
        newNotice.setWriter("관리자"); // 이부분은 관리자로 해두었는데 어차피 관리자밖에 작성할 수 없으므로 그냥 둬도됨
        newNotice.setView_count(0);
        newNotice.setPostType("NOTICE");
        newNotice.setCreatedAt(LocalDateTime.now());

        noticeRepository.save(newNotice);
    }
}