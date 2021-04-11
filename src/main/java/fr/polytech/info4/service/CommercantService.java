package fr.polytech.info4.service;

import fr.polytech.info4.service.dto.CommercantDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link fr.polytech.info4.domain.Commercant}.
 */
public interface CommercantService {
    /**
     * Save a commercant.
     *
     * @param commercantDTO the entity to save.
     * @return the persisted entity.
     */
    CommercantDTO save(CommercantDTO commercantDTO);

    /**
     * Partially updates a commercant.
     *
     * @param commercantDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CommercantDTO> partialUpdate(CommercantDTO commercantDTO);

    /**
     * Get all the commercants.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CommercantDTO> findAll(Pageable pageable);

    /**
     * Get the "id" commercant.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CommercantDTO> findOne(Long id);

    /**
     * Delete the "id" commercant.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
