package com.sewa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MasterDataResponse {
    private List<MasterItem> educationalLevels;
    private List<MasterItem> workingSectors;
    private List<MasterItem> genders;
}
