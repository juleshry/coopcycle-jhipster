package fr.polytech.info4.service;

import fr.polytech.info4.service.dto.CoursierDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link fr.polytech.info4.domain.Coursier}.
 */
public interface CoursierService {
    /**
     * Save a coursier.
     *
     * @param coursierDTO the entity to save.
     * @return the persisted entity.
     */
    CoursierDTO save(CoursierDTO coursierDTO);

    /**
     * Partially updates a coursier.
     *
     * @param coursierDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CoursierDTO> partialUpdate(CoursierDTO coursierDTO);

    /**
     * Get all the coursiers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CoursierDTO> findAll(Pageable pageable);

    /**
     * Get the "id" coursier.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CoursierDTO> findOne(Long id);

    /**
     * Delete the "id" coursier.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
