package fr.polytech.info4.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.polytech.info4.IntegrationTest;
import fr.polytech.info4.domain.Commercant;
import fr.polytech.info4.repository.CommercantRepository;
import fr.polytech.info4.service.dto.CommercantDTO;
import fr.polytech.info4.service.mapper.CommercantMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CommercantResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CommercantResourceIT {

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/commercants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommercantRepository commercantRepository;

    @Autowired
    private CommercantMapper commercantMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommercantMockMvc;

    private Commercant commercant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commercant createEntity(EntityManager em) {
        Commercant commercant = new Commercant().companyName(DEFAULT_COMPANY_NAME).address(DEFAULT_ADDRESS).phone(DEFAULT_PHONE);
        return commercant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commercant createUpdatedEntity(EntityManager em) {
        Commercant commercant = new Commercant().companyName(UPDATED_COMPANY_NAME).address(UPDATED_ADDRESS).phone(UPDATED_PHONE);
        return commercant;
    }

    @BeforeEach
    public void initTest() {
        commercant = createEntity(em);
    }

    @Test
    @Transactional
    void createCommercant() throws Exception {
        int databaseSizeBeforeCreate = commercantRepository.findAll().size();
        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);
        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercantDTO)))
            .andExpect(status().isCreated());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeCreate + 1);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testCommercant.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testCommercant.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void createCommercantWithExistingId() throws Exception {
        // Create the Commercant with an existing ID
        commercant.setId(1L);
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        int databaseSizeBeforeCreate = commercantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercantDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCompanyNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = commercantRepository.findAll().size();
        // set the field null
        commercant.setCompanyName(null);

        // Create the Commercant, which fails.
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercantDTO)))
            .andExpect(status().isBadRequest());

        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAddressIsRequired() throws Exception {
        int databaseSizeBeforeTest = commercantRepository.findAll().size();
        // set the field null
        commercant.setAddress(null);

        // Create the Commercant, which fails.
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercantDTO)))
            .andExpect(status().isBadRequest());

        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = commercantRepository.findAll().size();
        // set the field null
        commercant.setPhone(null);

        // Create the Commercant, which fails.
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        restCommercantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercantDTO)))
            .andExpect(status().isBadRequest());

        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCommercants() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        // Get all the commercantList
        restCommercantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commercant.getId().intValue())))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }

    @Test
    @Transactional
    void getCommercant() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        // Get the commercant
        restCommercantMockMvc
            .perform(get(ENTITY_API_URL_ID, commercant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(commercant.getId().intValue()))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingCommercant() throws Exception {
        // Get the commercant
        restCommercantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCommercant() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();

        // Update the commercant
        Commercant updatedCommercant = commercantRepository.findById(commercant.getId()).get();
        // Disconnect from session so that the updates on updatedCommercant are not directly saved in db
        em.detach(updatedCommercant);
        updatedCommercant.companyName(UPDATED_COMPANY_NAME).address(UPDATED_ADDRESS).phone(UPDATED_PHONE);
        CommercantDTO commercantDTO = commercantMapper.toDto(updatedCommercant);

        restCommercantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commercantDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commercantDTO))
            )
            .andExpect(status().isOk());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testCommercant.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCommercant.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commercantDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commercantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commercantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commercantDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommercantWithPatch() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();

        // Update the commercant using partial update
        Commercant partialUpdatedCommercant = new Commercant();
        partialUpdatedCommercant.setId(commercant.getId());

        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommercant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommercant))
            )
            .andExpect(status().isOk());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testCommercant.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testCommercant.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void fullUpdateCommercantWithPatch() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();

        // Update the commercant using partial update
        Commercant partialUpdatedCommercant = new Commercant();
        partialUpdatedCommercant.setId(commercant.getId());

        partialUpdatedCommercant.companyName(UPDATED_COMPANY_NAME).address(UPDATED_ADDRESS).phone(UPDATED_PHONE);

        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommercant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommercant))
            )
            .andExpect(status().isOk());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
        Commercant testCommercant = commercantList.get(commercantList.size() - 1);
        assertThat(testCommercant.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testCommercant.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCommercant.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, commercantDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commercantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commercantDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommercant() throws Exception {
        int databaseSizeBeforeUpdate = commercantRepository.findAll().size();
        commercant.setId(count.incrementAndGet());

        // Create the Commercant
        CommercantDTO commercantDTO = commercantMapper.toDto(commercant);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommercantMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(commercantDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Commercant in the database
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommercant() throws Exception {
        // Initialize the database
        commercantRepository.saveAndFlush(commercant);

        int databaseSizeBeforeDelete = commercantRepository.findAll().size();

        // Delete the commercant
        restCommercantMockMvc
            .perform(delete(ENTITY_API_URL_ID, commercant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Commercant> commercantList = commercantRepository.findAll();
        assertThat(commercantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
