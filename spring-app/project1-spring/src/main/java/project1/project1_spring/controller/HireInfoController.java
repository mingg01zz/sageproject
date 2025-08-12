package project1.project1_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HireInfoController {

    @GetMapping("/hireinfo")
    public String showHireInfoPage() {
        return "hireinfo";
    }
}