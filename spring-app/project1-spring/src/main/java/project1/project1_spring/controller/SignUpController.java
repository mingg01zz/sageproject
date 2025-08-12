package project1.project1_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SignUpController {

    @GetMapping("/signup")
    public String showSignUpPage() {
        return "signup"; // signup.html 템플릿 반환
    }
}