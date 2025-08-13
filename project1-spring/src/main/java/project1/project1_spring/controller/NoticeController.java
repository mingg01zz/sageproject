package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import project1.project1_spring.dto.BoardDto;
import project1.project1_spring.service.NoticeService;

import java.util.List;

@Controller
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public String showNoticePage(Model model) {
        List<BoardDto> noticeList = noticeService.findAll();
        model.addAttribute("noticeList", noticeList);
        return "notice";
    }

    @GetMapping("/write")
    public String showNoticeWritePage() {
        return "notice-noticewrite";
    }

    @PostMapping("/write")
    public String saveNotice(@RequestParam("title") String title, @RequestParam("content") String content) {
        noticeService.saveNotice(title, content);
        return "redirect:/notice";
    }

    @GetMapping("/{id}")
    public String showNoticeDetailPage(@PathVariable("id") Long id, Model model) {
        BoardDto notice = noticeService.findById(id);
        model.addAttribute("notice", notice);
        return "notice-detail";
    }
}