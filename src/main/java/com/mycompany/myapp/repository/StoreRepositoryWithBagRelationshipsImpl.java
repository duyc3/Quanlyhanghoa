package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Store;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class StoreRepositoryWithBagRelationshipsImpl implements StoreRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Store> fetchBagRelationships(Optional<Store> store) {
        return store.map(this::fetchProducts);
    }

    @Override
    public Page<Store> fetchBagRelationships(Page<Store> stores) {
        return new PageImpl<>(fetchBagRelationships(stores.getContent()), stores.getPageable(), stores.getTotalElements());
    }

    @Override
    public List<Store> fetchBagRelationships(List<Store> stores) {
        return Optional.of(stores).map(this::fetchProducts).orElse(Collections.emptyList());
    }

    Store fetchProducts(Store result) {
        return entityManager
            .createQuery("select store from Store store left join fetch store.products where store is :store", Store.class)
            .setParameter("store", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Store> fetchProducts(List<Store> stores) {
        return entityManager
            .createQuery("select distinct store from Store store left join fetch store.products where store in :stores", Store.class)
            .setParameter("stores", stores)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
