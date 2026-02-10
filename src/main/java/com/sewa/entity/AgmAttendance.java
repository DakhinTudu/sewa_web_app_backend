package com.sewa.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agm_attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgmAttendance {

    @EmbeddedId
    private AgmAttendanceId id;

    @ManyToOne
    @MapsId("agmId")
    @JoinColumn(name = "agm_id")
    private Content agm;

    @ManyToOne
    @MapsId("memberId")
    @JoinColumn(name = "member_id")
    private Member member;

    @Builder.Default
    private Boolean attended = true;
}
