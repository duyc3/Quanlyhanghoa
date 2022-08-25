package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.BillDetails;
import com.mycompany.myapp.repository.BillDetailsRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.BillDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BillDetailsResource {

    private final Logger log = LoggerFactory.getLogger(BillDetailsResource.class);

    private static final String ENTITY_NAME = "billDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BillDetailsRepository billDetailsRepository;

    public BillDetailsResource(BillDetailsRepository billDetailsRepository) {
        this.billDetailsRepository = billDetailsRepository;
    }

    /**
     * {@code POST  /bill-details} : Create a new billDetails.
     *
     * @param billDetails the billDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new billDetails, or with status {@code 400 (Bad Request)} if the billDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bill-details")
    public ResponseEntity<BillDetails> createBillDetails(@Valid @RequestBody BillDetails billDetails) throws URISyntaxException {
        log.debug("REST request to save BillDetails : {}", billDetails);
        if (billDetails.getId() != null) {
            throw new BadRequestAlertException("A new billDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BillDetails result = billDetailsRepository.save(billDetails);
        return ResponseEntity
            .created(new URI("/api/bill-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bill-details/:id} : Updates an existing billDetails.
     *
     * @param id the id of the billDetails to save.
     * @param billDetails the billDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated billDetails,
     * or with status {@code 400 (Bad Request)} if the billDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the billDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bill-details/{id}")
    public ResponseEntity<BillDetails> updateBillDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BillDetails billDetails
    ) throws URISyntaxException {
        log.debug("REST request to update BillDetails : {}, {}", id, billDetails);
        if (billDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, billDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!billDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BillDetails result = billDetailsRepository.save(billDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, billDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bill-details/:id} : Partial updates given fields of an existing billDetails, field will ignore if it is null
     *
     * @param id the id of the billDetails to save.
     * @param billDetails the billDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated billDetails,
     * or with status {@code 400 (Bad Request)} if the billDetails is not valid,
     * or with status {@code 404 (Not Found)} if the billDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the billDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bill-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BillDetails> partialUpdateBillDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BillDetails billDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update BillDetails partially : {}, {}", id, billDetails);
        if (billDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, billDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!billDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BillDetails> result = billDetailsRepository
            .findById(billDetails.getId())
            .map(existingBillDetails -> {
                if (billDetails.getAmount() != null) {
                    existingBillDetails.setAmount(billDetails.getAmount());
                }
                if (billDetails.getType() != null) {
                    existingBillDetails.setType(billDetails.getType());
                }
                if (billDetails.getCreateDate() != null) {
                    existingBillDetails.setCreateDate(billDetails.getCreateDate());
                }
                if (billDetails.getCreateBy() != null) {
                    existingBillDetails.setCreateBy(billDetails.getCreateBy());
                }

                return existingBillDetails;
            })
            .map(billDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, billDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /bill-details} : get all the billDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of billDetails in body.
     */
    @GetMapping("/bill-details")
    public List<BillDetails> getAllBillDetails() {
        log.debug("REST request to get all BillDetails");
        return billDetailsRepository.findAll();
    }

    /**
     * {@code GET  /bill-details/:id} : get the "id" billDetails.
     *
     * @param id the id of the billDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the billDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bill-details/{id}")
    public ResponseEntity<BillDetails> getBillDetails(@PathVariable Long id) {
        log.debug("REST request to get BillDetails : {}", id);
        Optional<BillDetails> billDetails = billDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(billDetails);
    }

    /**
     * {@code DELETE  /bill-details/:id} : delete the "id" billDetails.
     *
     * @param id the id of the billDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bill-details/{id}")
    public ResponseEntity<Void> deleteBillDetails(@PathVariable Long id) {
        log.debug("REST request to delete BillDetails : {}", id);
        billDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
