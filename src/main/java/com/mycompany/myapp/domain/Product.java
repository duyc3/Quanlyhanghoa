package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Product.
 */
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name_product", nullable = false)
    private String nameProduct;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "create_date")
    private LocalDate createDate;

    @Column(name = "create_by")
    private String createBy;

    @Column(name = "note")
    private String note;

    @OneToMany(mappedBy = "product")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "product", "bill" }, allowSetters = true)
    private Set<BillDetails> billDetails = new HashSet<>();

    @ManyToMany(mappedBy = "products")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private Set<Store> stores = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameProduct() {
        return this.nameProduct;
    }

    public Product nameProduct(String nameProduct) {
        this.setNameProduct(nameProduct);
        return this;
    }

    public void setNameProduct(String nameProduct) {
        this.nameProduct = nameProduct;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Product price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getCreateDate() {
        return this.createDate;
    }

    public Product createDate(LocalDate createDate) {
        this.setCreateDate(createDate);
        return this;
    }

    public void setCreateDate(LocalDate createDate) {
        this.createDate = createDate;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public Product createBy(String createBy) {
        this.setCreateBy(createBy);
        return this;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getNote() {
        return this.note;
    }

    public Product note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Set<BillDetails> getBillDetails() {
        return this.billDetails;
    }

    public void setBillDetails(Set<BillDetails> billDetails) {
        if (this.billDetails != null) {
            this.billDetails.forEach(i -> i.setProduct(null));
        }
        if (billDetails != null) {
            billDetails.forEach(i -> i.setProduct(this));
        }
        this.billDetails = billDetails;
    }

    public Product billDetails(Set<BillDetails> billDetails) {
        this.setBillDetails(billDetails);
        return this;
    }

    public Product addBillDetails(BillDetails billDetails) {
        this.billDetails.add(billDetails);
        billDetails.setProduct(this);
        return this;
    }

    public Product removeBillDetails(BillDetails billDetails) {
        this.billDetails.remove(billDetails);
        billDetails.setProduct(null);
        return this;
    }

    public Set<Store> getStores() {
        return this.stores;
    }

    public void setStores(Set<Store> stores) {
        if (this.stores != null) {
            this.stores.forEach(i -> i.removeProduct(this));
        }
        if (stores != null) {
            stores.forEach(i -> i.addProduct(this));
        }
        this.stores = stores;
    }

    public Product stores(Set<Store> stores) {
        this.setStores(stores);
        return this;
    }

    public Product addStore(Store store) {
        this.stores.add(store);
        store.getProducts().add(this);
        return this;
    }

    public Product removeStore(Store store) {
        this.stores.remove(store);
        store.getProducts().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", nameProduct='" + getNameProduct() + "'" +
            ", price=" + getPrice() +
            ", createDate='" + getCreateDate() + "'" +
            ", createBy='" + getCreateBy() + "'" +
            ", note='" + getNote() + "'" +
            "}";
    }
}
