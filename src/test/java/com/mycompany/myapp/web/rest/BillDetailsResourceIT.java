package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.BillDetails;
import com.mycompany.myapp.repository.BillDetailsRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link BillDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BillDetailsResourceIT {

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/bill-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BillDetailsRepository billDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBillDetailsMockMvc;

    private BillDetails billDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BillDetails createEntity(EntityManager em) {
        BillDetails billDetails = new BillDetails()
            .amount(DEFAULT_AMOUNT)
            .type(DEFAULT_TYPE)
            .createDate(DEFAULT_CREATE_DATE)
            .createBy(DEFAULT_CREATE_BY);
        return billDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BillDetails createUpdatedEntity(EntityManager em) {
        BillDetails billDetails = new BillDetails()
            .amount(UPDATED_AMOUNT)
            .type(UPDATED_TYPE)
            .createDate(UPDATED_CREATE_DATE)
            .createBy(UPDATED_CREATE_BY);
        return billDetails;
    }

    @BeforeEach
    public void initTest() {
        billDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createBillDetails() throws Exception {
        int databaseSizeBeforeCreate = billDetailsRepository.findAll().size();
        // Create the BillDetails
        restBillDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billDetails)))
            .andExpect(status().isCreated());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        BillDetails testBillDetails = billDetailsList.get(billDetailsList.size() - 1);
        assertThat(testBillDetails.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testBillDetails.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBillDetails.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testBillDetails.getCreateBy()).isEqualTo(DEFAULT_CREATE_BY);
    }

    @Test
    @Transactional
    void createBillDetailsWithExistingId() throws Exception {
        // Create the BillDetails with an existing ID
        billDetails.setId(1L);

        int databaseSizeBeforeCreate = billDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBillDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billDetails)))
            .andExpect(status().isBadRequest());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = billDetailsRepository.findAll().size();
        // set the field null
        billDetails.setAmount(null);

        // Create the BillDetails, which fails.

        restBillDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billDetails)))
            .andExpect(status().isBadRequest());

        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = billDetailsRepository.findAll().size();
        // set the field null
        billDetails.setType(null);

        // Create the BillDetails, which fails.

        restBillDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billDetails)))
            .andExpect(status().isBadRequest());

        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBillDetails() throws Exception {
        // Initialize the database
        billDetailsRepository.saveAndFlush(billDetails);

        // Get all the billDetailsList
        restBillDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(billDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(DEFAULT_CREATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].createBy").value(hasItem(DEFAULT_CREATE_BY)));
    }

    @Test
    @Transactional
    void getBillDetails() throws Exception {
        // Initialize the database
        billDetailsRepository.saveAndFlush(billDetails);

        // Get the billDetails
        restBillDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, billDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(billDetails.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.createDate").value(DEFAULT_CREATE_DATE.toString()))
            .andExpect(jsonPath("$.createBy").value(DEFAULT_CREATE_BY));
    }

    @Test
    @Transactional
    void getNonExistingBillDetails() throws Exception {
        // Get the billDetails
        restBillDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBillDetails() throws Exception {
        // Initialize the database
        billDetailsRepository.saveAndFlush(billDetails);

        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();

        // Update the billDetails
        BillDetails updatedBillDetails = billDetailsRepository.findById(billDetails.getId()).get();
        // Disconnect from session so that the updates on updatedBillDetails are not directly saved in db
        em.detach(updatedBillDetails);
        updatedBillDetails.amount(UPDATED_AMOUNT).type(UPDATED_TYPE).createDate(UPDATED_CREATE_DATE).createBy(UPDATED_CREATE_BY);

        restBillDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBillDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBillDetails))
            )
            .andExpect(status().isOk());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
        BillDetails testBillDetails = billDetailsList.get(billDetailsList.size() - 1);
        assertThat(testBillDetails.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testBillDetails.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBillDetails.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testBillDetails.getCreateBy()).isEqualTo(UPDATED_CREATE_BY);
    }

    @Test
    @Transactional
    void putNonExistingBillDetails() throws Exception {
        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();
        billDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBillDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, billDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(billDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBillDetails() throws Exception {
        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();
        billDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(billDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBillDetails() throws Exception {
        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();
        billDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(billDetails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBillDetailsWithPatch() throws Exception {
        // Initialize the database
        billDetailsRepository.saveAndFlush(billDetails);

        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();

        // Update the billDetails using partial update
        BillDetails partialUpdatedBillDetails = new BillDetails();
        partialUpdatedBillDetails.setId(billDetails.getId());

        partialUpdatedBillDetails.amount(UPDATED_AMOUNT).createDate(UPDATED_CREATE_DATE).createBy(UPDATED_CREATE_BY);

        restBillDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBillDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBillDetails))
            )
            .andExpect(status().isOk());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
        BillDetails testBillDetails = billDetailsList.get(billDetailsList.size() - 1);
        assertThat(testBillDetails.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testBillDetails.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testBillDetails.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testBillDetails.getCreateBy()).isEqualTo(UPDATED_CREATE_BY);
    }

    @Test
    @Transactional
    void fullUpdateBillDetailsWithPatch() throws Exception {
        // Initialize the database
        billDetailsRepository.saveAndFlush(billDetails);

        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();

        // Update the billDetails using partial update
        BillDetails partialUpdatedBillDetails = new BillDetails();
        partialUpdatedBillDetails.setId(billDetails.getId());

        partialUpdatedBillDetails.amount(UPDATED_AMOUNT).type(UPDATED_TYPE).createDate(UPDATED_CREATE_DATE).createBy(UPDATED_CREATE_BY);

        restBillDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBillDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBillDetails))
            )
            .andExpect(status().isOk());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
        BillDetails testBillDetails = billDetailsList.get(billDetailsList.size() - 1);
        assertThat(testBillDetails.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testBillDetails.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testBillDetails.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testBillDetails.getCreateBy()).isEqualTo(UPDATED_CREATE_BY);
    }

    @Test
    @Transactional
    void patchNonExistingBillDetails() throws Exception {
        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();
        billDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBillDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, billDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(billDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBillDetails() throws Exception {
        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();
        billDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(billDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBillDetails() throws Exception {
        int databaseSizeBeforeUpdate = billDetailsRepository.findAll().size();
        billDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBillDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(billDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BillDetails in the database
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBillDetails() throws Exception {
        // Initialize the database
        billDetailsRepository.saveAndFlush(billDetails);

        int databaseSizeBeforeDelete = billDetailsRepository.findAll().size();

        // Delete the billDetails
        restBillDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, billDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BillDetails> billDetailsList = billDetailsRepository.findAll();
        assertThat(billDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
