package com.sewa.service.impl;

import com.sewa.entity.EducationalLevelMaster;
import com.sewa.entity.GenderMaster;
import com.sewa.entity.WorkingSectorMaster;
import com.sewa.repository.EducationalLevelRepository;
import com.sewa.repository.GenderRepository;
import com.sewa.repository.WorkingSectorRepository;
import com.sewa.service.MasterDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterDataServiceImpl implements MasterDataService {

    private final EducationalLevelRepository educationalLevelRepository;
    private final WorkingSectorRepository workingSectorRepository;
    private final GenderRepository genderRepository;

    @Override
    public List<EducationalLevelMaster> getAllEducationalLevels() {
        return educationalLevelRepository.findByActiveTrue();
    }

    @Override
    public List<WorkingSectorMaster> getAllWorkingSectors() {
        return workingSectorRepository.findByActiveTrue();
    }

    @Override
    public List<GenderMaster> getAllGenders() {
        return genderRepository.findByActiveTrue();
    }
}
