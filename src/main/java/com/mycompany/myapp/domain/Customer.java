package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name_customer", nullable = false)
    private String nameCustomer;

    @NotNull
    @Column(name = "age_customer", nullable = false)
    private Integer ageCustomer;

    @NotNull
    @Column(name = "address_customer", nullable = false)
    private String addressCustomer;

    @NotNull
    @Column(name = "numberphone_customer", nullable = false)
    private Integer numberphoneCustomer;

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "billDetails", "customer", "staff" }, allowSetters = true)
    private Set<Bill> bills = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Customer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameCustomer() {
        return this.nameCustomer;
    }

    public Customer nameCustomer(String nameCustomer) {
        this.setNameCustomer(nameCustomer);
        return this;
    }

    public void setNameCustomer(String nameCustomer) {
        this.nameCustomer = nameCustomer;
    }

    public Integer getAgeCustomer() {
        return this.ageCustomer;
    }

    public Customer ageCustomer(Integer ageCustomer) {
        this.setAgeCustomer(ageCustomer);
        return this;
    }

    public void setAgeCustomer(Integer ageCustomer) {
        this.ageCustomer = ageCustomer;
    }

    public String getAddressCustomer() {
        return this.addressCustomer;
    }

    public Customer addressCustomer(String addressCustomer) {
        this.setAddressCustomer(addressCustomer);
        return this;
    }

    public void setAddressCustomer(String addressCustomer) {
        this.addressCustomer = addressCustomer;
    }

    public Integer getNumberphoneCustomer() {
        return this.numberphoneCustomer;
    }

    public Customer numberphoneCustomer(Integer numberphoneCustomer) {
        this.setNumberphoneCustomer(numberphoneCustomer);
        return this;
    }

    public void setNumberphoneCustomer(Integer numberphoneCustomer) {
        this.numberphoneCustomer = numberphoneCustomer;
    }

    public Set<Bill> getBills() {
        return this.bills;
    }

    public void setBills(Set<Bill> bills) {
        if (this.bills != null) {
            this.bills.forEach(i -> i.setCustomer(null));
        }
        if (bills != null) {
            bills.forEach(i -> i.setCustomer(this));
        }
        this.bills = bills;
    }

    public Customer bills(Set<Bill> bills) {
        this.setBills(bills);
        return this;
    }

    public Customer addBill(Bill bill) {
        this.bills.add(bill);
        bill.setCustomer(this);
        return this;
    }

    public Customer removeBill(Bill bill) {
        this.bills.remove(bill);
        bill.setCustomer(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", nameCustomer='" + getNameCustomer() + "'" +
            ", ageCustomer=" + getAgeCustomer() +
            ", addressCustomer='" + getAddressCustomer() + "'" +
            ", numberphoneCustomer=" + getNumberphoneCustomer() +
            "}";
    }
}
