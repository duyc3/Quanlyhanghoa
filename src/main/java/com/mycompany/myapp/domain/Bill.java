package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bill.
 */
@Entity
@Table(name = "bill")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bill implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "create_date")
    private LocalDate createDate;

    @Column(name = "create_by")
    private String createBy;

    @OneToMany(mappedBy = "bill")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "bill" }, allowSetters = true)
    private Set<BillDetails> billDetails = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "bills" }, allowSetters = true)
    private Customer customer;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bills" }, allowSetters = true)
    private Staff staff;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bill id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreateDate() {
        return this.createDate;
    }

    public Bill createDate(LocalDate createDate) {
        this.setCreateDate(createDate);
        return this;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public Bill createBy(String createBy) {
        this.setCreateBy(createBy);
        return this;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Set<BillDetails> getBillDetails() {
        return this.billDetails;
    }

    public void setBillDetails(Set<BillDetails> billDetails) {
        if (this.billDetails != null) {
            this.billDetails.forEach(i -> i.setBill(null));
        }
        if (billDetails != null) {
            billDetails.forEach(i -> i.setBill(this));
        }
        this.billDetails = billDetails;
    }

    public Bill billDetails(Set<BillDetails> billDetails) {
        this.setBillDetails(billDetails);
        return this;
    }

    public Bill addBillDetails(BillDetails billDetails) {
        this.billDetails.add(billDetails);
        billDetails.setBill(this);
        return this;
    }

    public Bill removeBillDetails(BillDetails billDetails) {
        this.billDetails.remove(billDetails);
        billDetails.setBill(null);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Bill customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public Staff getStaff() {
        return this.staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public Bill staff(Staff staff) {
        this.setStaff(staff);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bill)) {
            return false;
        }
        return id != null && id.equals(((Bill) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bill{" +
            "id=" + getId() +
            ", createDate='" + getCreateDate() + "'" +
            ", createBy='" + getCreateBy() + "'" +
            "}";
    }
}
