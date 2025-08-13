package project1.project1_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import project1.project1_spring.domain.Facility;
import project1.project1_spring.service.FacilityService;

import java.util.List;

@Controller
public class FacilityController {

    private final FacilityService facilityService;

    @Autowired
    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping("/facilities")
    public String getFacilities(Model model) {
        List<Facility> facilityList = facilityService.findAllFacilities();
        model.addAttribute("facilityList", facilityList);
        return "index";
    }
}