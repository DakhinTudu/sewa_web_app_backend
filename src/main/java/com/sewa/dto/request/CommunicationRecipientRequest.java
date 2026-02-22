package com.sewa.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommunicationRecipientRequest {

    public static final String BASE_ALL = "ALL";
    public static final String BASE_BY_CHAPTER = "BY_CHAPTER";
    public static final String BASE_BY_PAYMENT_STATUS = "BY_PAYMENT_STATUS";
    public static final String BASE_MANUAL = "MANUAL";

    public static final String PAYMENT_UNPAID_CURRENT_YEAR = "UNPAID_CURRENT_YEAR";

    /** ALL, BY_CHAPTER, BY_PAYMENT_STATUS, MANUAL */
    private String baseType;

    /** For BY_CHAPTER: list of chapter IDs */
    private List<Integer> chapterIds;

    /** For BY_PAYMENT_STATUS: e.g. UNPAID_CURRENT_YEAR */
    private String paymentFilter;

    /** For MANUAL: member IDs to send to */
    private List<Integer> memberIds;

    /** Optional: always include these member IDs (added to resolved list) */
    private List<Integer> includeMemberIds;

    /** Optional: exclude these member IDs from resolved list */
    private List<Integer> excludeMemberIds;
}
