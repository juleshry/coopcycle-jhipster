package fr.polytech.info4.service.impl;

import fr.polytech.info4.domain.Coursier;
import fr.polytech.info4.repository.CoursierRepository;
import fr.polytech.info4.service.CoursierService;
import fr.polytech.info4.service.dto.CoursierDTO;
import fr.polytech.info4.service.mapper.CoursierMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Coursier}.
 */
@Service
@Transactional
public class CoursierServiceImpl implements CoursierService {

    private final Logger log = LoggerFactory.getLogger(CoursierServiceImpl.class);

    private final CoursierRepository coursierRepository;

    private final CoursierMapper coursierMapper;

    public CoursierServiceImpl(CoursierRepository coursierRepository, CoursierMapper coursierMapper) {
        this.coursierRepository = coursierRepository;
        this.coursierMapper = coursierMapper;
    }

    @Override
    public CoursierDTO save(CoursierDTO coursierDTO) {
        log.debug("Request to save Coursier : {}", coursierDTO);
        Coursier coursier = coursierMapper.toEntity(coursierDTO);
        coursier = coursierRepository.save(coursier);
        return coursierMapper.toDto(coursier);
    }

    @Override
    public Optional<CoursierDTO> partialUpdate(CoursierDTO coursierDTO) {
        log.debug("Request to partially update Coursier : {}", coursierDTO);

        return coursierRepository
            .findById(coursierDTO.getId())
            .map(
                existingCoursier -> {
                    coursierMapper.partialUpdate(existingCoursier, coursierDTO);
                    return existingCoursier;
                }
            )
            .map(coursierRepository::save)
            .map(coursierMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CoursierDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Coursiers");
        return coursierRepository.findAll(pageable).map(coursierMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CoursierDTO> findOne(Long id) {
        log.debug("Request to get Coursier : {}", id);
        return coursierRepository.findById(id).map(coursierMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Coursier : {}", id);
        coursierRepository.deleteById(id);
    }
}
