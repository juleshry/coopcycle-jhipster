package fr.polytech.info4.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CommercantMapperTest {

    private CommercantMapper commercantMapper;

    @BeforeEach
    public void setUp() {
        commercantMapper = new CommercantMapperImpl();
    }
}
