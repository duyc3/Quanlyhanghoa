package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Store;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface StoreRepositoryWithBagRelationships {
    Optional<Store> fetchBagRelationships(Optional<Store> store);

    List<Store> fetchBagRelationships(List<Store> stores);

    Page<Store> fetchBagRelationships(Page<Store> stores);
}
