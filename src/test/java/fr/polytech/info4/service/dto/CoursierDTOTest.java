package fr.polytech.info4.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import fr.polytech.info4.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CoursierDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CoursierDTO.class);
        CoursierDTO coursierDTO1 = new CoursierDTO();
        coursierDTO1.setId(1L);
        CoursierDTO coursierDTO2 = new CoursierDTO();
        assertThat(coursierDTO1).isNotEqualTo(coursierDTO2);
        coursierDTO2.setId(coursierDTO1.getId());
        assertThat(coursierDTO1).isEqualTo(coursierDTO2);
        coursierDTO2.setId(2L);
        assertThat(coursierDTO1).isNotEqualTo(coursierDTO2);
        coursierDTO1.setId(null);
        assertThat(coursierDTO1).isNotEqualTo(coursierDTO2);
    }
}
