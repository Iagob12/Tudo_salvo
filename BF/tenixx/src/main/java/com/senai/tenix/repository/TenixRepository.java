package com.senai.tenix.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.senai.tenix.model.TenixModel;

@Repository
public interface TenixRepository extends JpaRepository<TenixModel, Long> {  // Alterei de UUID para Long
}
