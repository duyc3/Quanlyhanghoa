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
 * A Staff.
 */
@Entity
@Table(name = "staff")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Staff implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name_staff", nullable = false)
    private String nameStaff;

    @NotNull
    @Column(name = "age_staff", nullable = false)
    private Integer ageStaff;

    @NotNull
    @Column(name = "address_staff", nullable = false)
    private String addressStaff;

    @NotNull
    @Column(name = "numberphone_staff", nullable = false)
    private Integer numberphoneStaff;

    @OneToMany(mappedBy = "staff")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "billDetails", "customer", "staff" }, allowSetters = true)
    private Set<Bill> bills = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Staff id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameStaff() {
        return this.nameStaff;
    }

    public Staff nameStaff(String nameStaff) {
        this.setNameStaff(nameStaff);
        return this;
    }

    public void setNameStaff(String nameStaff) {
        this.nameStaff = nameStaff;
    }

    public Integer getAgeStaff() {
        return this.ageStaff;
    }

    public Staff ageStaff(Integer ageStaff) {
        this.setAgeStaff(ageStaff);
        return this;
    }

    public void setAgeStaff(Integer ageStaff) {
        this.ageStaff = ageStaff;
    }

    public String getAddressStaff() {
        return this.addressStaff;
    }

    public Staff addressStaff(String addressStaff) {
        this.setAddressStaff(addressStaff);
        return this;
    }

    public void setAddressStaff(String addressStaff) {
        this.addressStaff = addressStaff;
    }

    public Integer getNumberphoneStaff() {
        return this.numberphoneStaff;
    }

    public Staff numberphoneStaff(Integer numberphoneStaff) {
        this.setNumberphoneStaff(numberphoneStaff);
        return this;
    }

    public void setNumberphoneStaff(Integer numberphoneStaff) {
        this.numberphoneStaff = numberphoneStaff;
    }

    public Set<Bill> getBills() {
        return this.bills;
    }

    public void setBills(Set<Bill> bills) {
        if (this.bills != null) {
            this.bills.forEach(i -> i.setStaff(null));
        }
        if (bills != null) {
            bills.forEach(i -> i.setStaff(this));
        }
        this.bills = bills;
    }

    public Staff bills(Set<Bill> bills) {
        this.setBills(bills);
        return this;
    }

    public Staff addBill(Bill bill) {
        this.bills.add(bill);
        bill.setStaff(this);
        return this;
    }

    public Staff removeBill(Bill bill) {
        this.bills.remove(bill);
        bill.setStaff(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Staff)) {
            return false;
        }
        return id != null && id.equals(((Staff) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Staff{" +
            "id=" + getId() +
            ", nameStaff='" + getNameStaff() + "'" +
            ", ageStaff=" + getAgeStaff() +
            ", addressStaff='" + getAddressStaff() + "'" +
            ", numberphoneStaff=" + getNumberphoneStaff() +
            "}";
    }
}
