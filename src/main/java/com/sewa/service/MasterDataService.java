package com.sewa.service;

import com.sewa.entity.EducationalLevelMaster;
import com.sewa.entity.GenderMaster;
import com.sewa.entity.WorkingSectorMaster;

import java.util.List;

public interface MasterDataService {
    List<EducationalLevelMaster> getAllEducationalLevels();

    List<WorkingSectorMaster> getAllWorkingSectors();

    List<GenderMaster> getAllGenders();
}
