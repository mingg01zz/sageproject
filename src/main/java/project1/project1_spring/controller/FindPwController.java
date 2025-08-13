package project1.project1_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FindPwController {

    @GetMapping("/findpw")
    public String showFindPwPage() {
        return "findpw";
    }
}