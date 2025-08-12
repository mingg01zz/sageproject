package project1.project1_spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project1.project1_spring.dto.FaqDto;
import project1.project1_spring.repository.FaqRepository;

import java.util.List;

@Service
public class FaqService {

    private final FaqRepository faqRepository;

    @Autowired
    public FaqService(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    public List<FaqDto> findAll() {
        return faqRepository.findAll();
    }

    public FaqDto findById(Long id) {
        return faqRepository.findById(id);
    }

    public void save(FaqDto faqDto) {
        faqRepository.save(faqDto);
    }
}