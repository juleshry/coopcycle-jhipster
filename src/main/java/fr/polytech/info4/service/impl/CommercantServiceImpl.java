package fr.polytech.info4.service.impl;

import fr.polytech.info4.domain.Commercant;
import fr.polytech.info4.repository.CommercantRepository;
import fr.polytech.info4.service.CommercantService;
import fr.polytech.info4.service.dto.CommercantDTO;
import fr.polytech.info4.service.mapper.CommercantMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Commercant}.
 */
@Service
@Transactional
public class CommercantServiceImpl implements CommercantService {

    private final Logger log = LoggerFactory.getLogger(CommercantServiceImpl.class);

    private final CommercantRepository commercantRepository;

    private final CommercantMapper commercantMapper;

    public CommercantServiceImpl(CommercantRepository commercantRepository, CommercantMapper commercantMapper) {
        this.commercantRepository = commercantRepository;
        this.commercantMapper = commercantMapper;
    }

    @Override
    public CommercantDTO save(CommercantDTO commercantDTO) {
        log.debug("Request to save Commercant : {}", commercantDTO);
        Commercant commercant = commercantMapper.toEntity(commercantDTO);
        commercant = commercantRepository.save(commercant);
        return commercantMapper.toDto(commercant);
    }

    @Override
    public Optional<CommercantDTO> partialUpdate(CommercantDTO commercantDTO) {
        log.debug("Request to partially update Commercant : {}", commercantDTO);

        return commercantRepository
            .findById(commercantDTO.getId())
            .map(
                existingCommercant -> {
                    commercantMapper.partialUpdate(existingCommercant, commercantDTO);
                    return existingCommercant;
                }
            )
            .map(commercantRepository::save)
            .map(commercantMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommercantDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Commercants");
        return commercantRepository.findAll(pageable).map(commercantMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CommercantDTO> findOne(Long id) {
        log.debug("Request to get Commercant : {}", id);
        return commercantRepository.findById(id).map(commercantMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Commercant : {}", id);
        commercantRepository.deleteById(id);
    }
}
