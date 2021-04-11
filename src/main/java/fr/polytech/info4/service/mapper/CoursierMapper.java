package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.CoursierDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Coursier} and its DTO {@link CoursierDTO}.
 */
@Mapper(componentModel = "spring", uses = { UserMapper.class })
public interface CoursierMapper extends EntityMapper<CoursierDTO, Coursier> {
    @Mapping(target = "user", source = "user", qualifiedByName = "login")
    CoursierDTO toDto(Coursier s);
}
