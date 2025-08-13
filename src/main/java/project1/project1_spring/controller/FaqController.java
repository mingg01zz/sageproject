package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import project1.project1_spring.dto.FaqDto;
import project1.project1_spring.service.FaqService;

import java.util.List;

@Controller
@RequestMapping("/faq")
public class FaqController {

    private final FaqService faqService;

    @Autowired
    public FaqController(FaqService faqService) {
        this.faqService = faqService;
    }

    @GetMapping
    public String showFaqPage(Model model) {
        List<FaqDto> faqList = faqService.findAll();
        model.addAttribute("faqList", faqList);
        return "faq";
    }

    @GetMapping("/write")
    public String showFaqWritePage() {
        return "faq-faqwrite";
    }

    @PostMapping("/write")
    public String createFaq(FaqDto faqDto) {
        faqService.save(faqDto);
        return "redirect:/faq";
    }

    @GetMapping("/{id}")
    public String showFaqDetailPage(@PathVariable("id") Long id, Model model) {
        FaqDto faq = faqService.findById(id);
        model.addAttribute("faq", faq);
        return "faq-detail";
    }
}