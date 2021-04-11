package fr.polytech.info4.repository;

import fr.polytech.info4.domain.Coursier;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Coursier entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CoursierRepository extends JpaRepository<Coursier, Long> {}
