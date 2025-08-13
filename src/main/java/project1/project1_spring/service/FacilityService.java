package project1.project1_spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project1.project1_spring.domain.Facility;
import project1.project1_spring.repository.FacilityRepository;

import java.util.List;

@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    @Autowired
    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    public List<Facility> findAllFacilities() {
        return facilityRepository.findAll();
    }
}