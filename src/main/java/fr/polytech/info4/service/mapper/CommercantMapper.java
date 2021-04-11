package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.CommercantDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Commercant} and its DTO {@link CommercantDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface CommercantMapper extends EntityMapper<CommercantDTO, Commercant> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    CommercantDTO toDto(Commercant s);
}
